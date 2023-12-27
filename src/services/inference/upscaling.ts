import { InferenceSession, Tensor } from 'onnxruntime-web'
import { fetchModel, imageNDarrayToDataURI, prepareImage } from './utils'
import ndarray, { NdArray } from 'ndarray'

import ops from 'ndarray-ops'

let superSession: InferenceSession | null = null

export async function runSuperRes(imageArray: NdArray): Promise<Tensor | undefined> {
  // @ts-ignore
  const feeds = prepareImage(imageArray, 'superRes')

  let sr: Tensor | undefined
  try {
    const output: InferenceSession.OnnxValueMapType = await superSession!.run(feeds)
    sr = output.output
  } catch (e) {
    console.log('Failed to run super resolution')
    console.log(e)
  }
  return sr
}

export async function initializeSuperRes(setProgress: (progress: number) => void): Promise<void> {
  console.debug('Initializing super resolution')
  if (superSession !== null) {
    return
  }

  const superBuf = await fetchModel('./models/superRes.onnx', setProgress, 0.5, 0.9)
  superSession = await InferenceSession.create(superBuf, {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: 'sequential', // Inter-op sequential
  })
}

export async function multiUpscale(
  imageArray: NdArray,
  upscaleFactor: number,
  outputType: string = 'image/png',
): Promise<string> {
  let outArr = imageArray
  console.time('Upscaling')
  for (let s = 0; s < upscaleFactor; s += 1) {
    outArr = await upscaleFrame(outArr)
  }
  console.timeEnd('Upscaling')

  // @ts-ignore
  return imageNDarrayToDataURI(outArr, outputType)
}

async function upscaleFrame(imageArray: NdArray): Promise<NdArray> {
  const CHUNK_SIZE = 1024
  const PAD_SIZE = 32

  const inImgW = imageArray.shape[0]
  const inImgH = imageArray.shape[1]
  const outImgW = inImgW * 2
  const outImgH = inImgH * 2
  const nChunksW = Math.ceil(inImgW / CHUNK_SIZE)
  const nChunksH = Math.ceil(inImgH / CHUNK_SIZE)
  const chunkW = Math.floor(inImgW / nChunksW)
  const chunkH = Math.floor(inImgH / nChunksH)

  const outArr = ndarray(new Uint8Array(outImgW * outImgH * 4), [outImgW, outImgH, 4])
  for (let i = 0; i < nChunksH; i += 1) {
    for (let j = 0; j < nChunksW; j += 1) {
      const x = j * chunkW
      const y = i * chunkH

      const yStart = Math.max(0, y - PAD_SIZE)
      const inH = yStart + chunkH + PAD_SIZE * 2 > inImgH ? inImgH - yStart : chunkH + PAD_SIZE * 2
      const outH = 2 * (Math.min(inImgH, y + chunkH) - y)
      const xStart = Math.max(0, x - PAD_SIZE)
      const inW = xStart + chunkW + PAD_SIZE * 2 > inImgW ? inImgW - xStart : chunkW + PAD_SIZE * 2
      const outW = 2 * (Math.min(inImgW, x + chunkW) - x)

      const inSlice = imageArray.lo(xStart, yStart, 0).hi(inW, inH, 4)
      const subArr = ndarray(new Uint8Array(inW * inH * 4), inSlice.shape)
      ops.assign(subArr, inSlice)

      const chunkData = await runSuperRes(subArr)
      const chunkArr = ndarray(chunkData!.data, [...chunkData!.dims])
      const chunkSlice = chunkArr.lo((x - xStart) * 2, (y - yStart) * 2, 0).hi(outW, outH, 4)
      const outSlice = outArr.lo(x * 2, y * 2, 0).hi(outW, outH, 4)
      ops.assign(outSlice, chunkSlice)
    }
  }

  return outArr
}
