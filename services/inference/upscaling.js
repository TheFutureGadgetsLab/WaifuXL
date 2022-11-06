import ndarray from 'ndarray'
import ops from 'ndarray-ops'
import { buildImageFromND, buildNdarrayFromImageOutput } from '@/services/processingUtilities'
import { fetchModel, prepareImage } from './utils'
import * as ort from 'onnxruntime-web'

let superSession = null

export async function runSuperRes(imageArray) {
  const feeds = prepareImage(imageArray)

  let sr
  try {
    const output = await superSession.run(feeds)
    sr = output.output
  } catch (e) {
    console.log('Failed to run super resolution')
    console.log(e)
  }
  return sr
}

export async function initializeSuperRes(setProgress) {
  console.debug('Initializing super resolution')
  if (superSession !== null) {
    return
  }

  const superBuf = await fetchModel('./models/superRes.onnx', setProgress, 0.5, 0.9)
  superSession = await ort.InferenceSession.create(superBuf, {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: 'sequential', // Inter-op sequential
  })
}

/**
 * Upscales image pixel data using the super resolution model. The image is split
 *   into chunks of size chunkSize to avoid running out of memory on the WASM side.
 *
 * @param {ndarray} inputData Image data as pixels in a ndarray
 * @param {Number} upscaleFactor How many times to repeat the super resolution
 * @returns Upscaled image as URI
 */
export async function multiUpscale(imageArray, upscaleFactor) {
  let outArr = imageArray
  console.time('Upscaling')
  for (let s = 0; s < upscaleFactor; s += 1) {
    outArr = await upscaleFrame(outArr)
  }
  console.timeEnd('Upscaling')

  // Reshape network output into a normal image
  const outImgH = outArr.shape[2]
  const outImgW = outArr.shape[3]
  const outImg = buildNdarrayFromImageOutput(outArr, outImgH, outImgW)
  const outURI = buildImageFromND(outImg, outImgH, outImgW)
  return outURI
}

async function upscaleFrame(imageArray) {
  const CHUNK_SIZE = 1024
  const PAD_SIZE = 32

  const inImgH = imageArray.shape[2]
  const inImgW = imageArray.shape[3]
  const outImgH = inImgH * 2
  const outImgW = inImgW * 2
  const nChunksH = Math.ceil(inImgH / CHUNK_SIZE)
  const nChunksW = Math.ceil(inImgW / CHUNK_SIZE)
  const chunkH = Math.floor(inImgH / nChunksH)
  const chunkW = Math.floor(inImgW / nChunksW)

  console.log(`Upscaling ${inImgH}x${inImgW} -> ${outImgH}x${outImgW}`)
  console.log(`Chunk size: ${chunkH}x${chunkW}`)
  console.log(`Number of chunks: ${nChunksH}x${nChunksW}`)

  // Split the image in chunks and run super resolution on each chunk
  // Time execution
  const outArr = ndarray(new Uint8Array(3 * outImgH * outImgW), [1, 3, outImgH, outImgW])
  for (let i = 0; i < nChunksH; i += 1) {
    for (let j = 0; j < nChunksW; j += 1) {
      const x = j * chunkW
      const y = i * chunkH

      // Compute chunk bounds including padding
      const yStart = Math.max(0, y - PAD_SIZE)
      const inH = yStart + chunkH + PAD_SIZE * 2 > inImgH ? inImgH - yStart : chunkH + PAD_SIZE * 2
      const outH = 2 * (Math.min(inImgH, y + chunkH) - y)
      const xStart = Math.max(0, x - PAD_SIZE)
      const inW = xStart + chunkW + PAD_SIZE * 2 > inImgW ? inImgW - xStart : chunkW + PAD_SIZE * 2
      const outW = 2 * (Math.min(inImgW, x + chunkW) - x)

      // Create sliced and copy
      console.debug(`Chunk ${i}x${j}  (${yStart}, ${xStart})  (${inH}, ${inW}) -> (${outH}, ${outW})`)
      const inSlice = imageArray.lo(0, 0, yStart, xStart).hi(1, 3, inH, inW)
      const subArr = ndarray(new Uint8Array(inH * inW * 3), inSlice.shape)
      ops.assign(subArr, inSlice)

      // Run the super resolution model on the chunk, copy the result into the combined array
      const chunkData = await runSuperRes(subArr)
      const chunkArr = ndarray(chunkData.data, chunkData.dims)
      const chunkSlice = chunkArr.lo(0, 0, (y - yStart) * 2, (x - xStart) * 2).hi(1, 3, outH, outW)
      const outSlice = outArr.lo(0, 0, y * 2, x * 2).hi(1, 3, outH, outW)
      ops.assign(outSlice, chunkSlice)
    }
  }

  return outArr
}
