import { InferenceSession, Tensor, TypedTensor } from 'onnxruntime-web'
import ndarray, { NdArray } from 'ndarray'

import ops from 'ndarray-ops'
import { prepareImage } from './utils'

export async function runSuperRes(session: InferenceSession, imageArray: NdArray): Promise<Tensor | undefined> {
  const feeds = prepareImage(imageArray)

  let sr: Tensor | undefined
  try {
    const output: InferenceSession.OnnxValueMapType = await session.run(feeds)
    sr = output.output
  } catch (e) {
    console.log('Failed to run super resolution')
    console.log(e)
  }
  return sr
}

export async function multiUpscale(
  session: InferenceSession,
  imageArray: TypedTensor<'uint8'>,
  upscaleFactor: number,
): Promise<string> {
  let outArr = ndarray(new Uint8Array(imageArray.data), imageArray.dims as number[])
  outArr = outArr.pick(0, null, null, null)
  outArr = outArr.transpose(2, 1, 0)

  console.time('Upscaling')
  for (let s = 0; s < upscaleFactor; s += 1) {
    outArr = await upscaleFrame(session, outArr)
  }
  console.timeEnd('Upscaling')

  return imgToDataURL(outArr)
}

async function upscaleFrame(session: InferenceSession, imageArray: NdArray): Promise<NdArray<Uint8Array>> {
  const CHUNK_SIZE = 1024
  const PAD_SIZE = 32

  const [inImgW, inImgH] = imageArray.shape
  const outImgW = inImgW * 2
  const outImgH = inImgH * 2
  const numChunksWidth = Math.ceil(inImgW / CHUNK_SIZE)
  const numChunksHeight = Math.ceil(inImgH / CHUNK_SIZE)

  const chunkWidth = Math.floor(inImgW / numChunksWidth)
  const chunkHeight = Math.floor(inImgH / numChunksHeight)

  const outArr = ndarray(new Uint8Array(outImgW * outImgH * 4), [outImgW, outImgH, 4])

  for (let r = 0; r < numChunksHeight; r++) {
    for (let c = 0; c < numChunksWidth; c++) {
      const [x, y] = [c * chunkWidth, r * chunkHeight]
      const [xStart, yStart] = [Math.max(0, x - PAD_SIZE), Math.max(0, y - PAD_SIZE)]
      const [inW, inH] = [
        Math.min(xStart + chunkWidth + PAD_SIZE * 2, inImgW) - xStart,
        Math.min(yStart + chunkHeight + PAD_SIZE * 2, inImgH) - yStart,
      ]
      const [outW, outH] = [2 * (Math.min(inImgW, x + chunkWidth) - x), 2 * (Math.min(inImgH, y + chunkHeight) - y)]

      const inSlice = imageArray.lo(xStart, yStart, 0).hi(inW, inH, 4)
      const subArr = ndarray(new Uint8Array(inW * inH * 4), inSlice.shape)
      ops.assign(subArr, inSlice)

      const chunkData = await runSuperRes(session, subArr).catch((error) => {
        console.error('Error in runSuperRes:', error)
        return null
      })
      if (!chunkData) continue

      const chunkArr = ndarray(chunkData.data, [...chunkData.dims])
      const chunkSlice = chunkArr.lo((x - xStart) * 2, (y - yStart) * 2, 0).hi(outW, outH, 4)
      const outSlice = outArr.lo(x * 2, y * 2, 0).hi(outW, outH, 4)
      ops.assign(outSlice, chunkSlice)
    }
  }

  return outArr
}

function imgToDataURL(img: NdArray<Uint8Array>): string {
  const [height, width] = img.shape.slice(0, 2)

  img = img.transpose(1, 0, 2)

  let buffer = new Uint8ClampedArray(width * height * 4) // RGBA for each pixel
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      buffer[row * width * 4 + col * 4] = img.get(row, col, 0) // Red
      buffer[row * width * 4 + col * 4 + 1] = img.get(row, col, 1) // Green
      buffer[row * width * 4 + col * 4 + 2] = img.get(row, col, 2) // Blue
      buffer[row * width * 4 + col * 4 + 3] = 255 // Alpha
    }
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Unable to get canvas context')
  }

  canvas.width = height
  canvas.height = width

  const imageData = ctx.createImageData(width, height)
  imageData.data.set(buffer)

  ctx.putImageData(imageData, 0, 0)

  return canvas.toDataURL('image/png')
}
