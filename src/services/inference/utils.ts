import { env as ORTEnv, Tensor, TypedTensor } from 'onnxruntime-web'
import { initializeSuperRes, multiUpscale } from '@/services/inference/upscaling'
import { initializeTagger, runTagger } from '@/services/inference/tagging'
import ndarray, { NdArray } from 'ndarray'

import ops from 'ndarray-ops'

const savePixels = require('save-pixels')

export function imageNDarrayToDataURI(data: NdArray, outputType: string): string {
  const canvas = savePixels(data, 'canvas')

  return canvas.toDataURL(outputType)
}

/**
 * Sleep for the provided number of milliseconds
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after the sleep is complete
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Converts an ndarray of pixels ([1, 3, height, width]) to an ORT tensor ([1, 3, height, width])
 * @param imageArray The ndarray of image pixels
 * @param model The model to use for preparation
 * @returns ORT Tensor
 */
export function prepareImage(imageArray: NdArray, model: string): { input: Tensor } {
  const width = imageArray.shape[0]
  const height = imageArray.shape[1]

  if (model === 'superRes') {
    const data = imageArray.data as number[]
    const tensor = new Tensor('uint8', data.slice(), [width, height, 4])
    return { input: tensor }
  } else if (model === 'tagger') {
    const newND = ndarray(new Uint8Array(width * height * 3), [1, 3, height, width])
    ops.assign(newND.pick(0, null, null), imageArray.lo(0, 0, 0).hi(width, height, 3).transpose(2, 1, 0))
    const tensor = new Tensor('uint8', newND.data.slice(), [1, 3, height, width])
    return { input: tensor }
  } else {
    console.error('Invalid model type')
    throw new Error('Invalid model type')
  }
}

export async function initializeONNX(): Promise<void> {
  // Set up ORT environment
  ORTEnv.wasm.simd = true
  ORTEnv.wasm.proxy = true
  ORTEnv.wasm.numThreads = Math.min(navigator.hardwareConcurrency / 2, 16)

  await initializeTagger()
  await initializeSuperRes()

  // Needed because WASM workers are created async, wait for them
  // to be ready
  await sleep(300)
}

export async function upScaleFromURI(
  extension: string,
  setTags: (tags: any) => void,
  uri: string,
  upscaleFactor: number,
): Promise<string | null> {
  let resultURI: string | null = null

  var image = await imageDataToTensor(uri)
  const tags = await runTagger(image)
  setTags(tags)

  resultURI = await multiUpscale(image, upscaleFactor)
  return resultURI
}

async function imageDataToTensor(imgpath: string): Promise<TypedTensor<'uint8'>> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Error loading image'))
    img.src = imgpath
  })

  // Draw image on canvas
  const canvas = document.createElement('canvas')
  Object.assign(canvas, { width: image.width, height: image.height })
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.drawImage(image, 0, 0)

  // Extract image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const imageBufferData = imageData.data

  // Rest of your code to process the image data and create a tensor...
  const redArray = []
  const greenArray = []
  const blueArray = []

  for (let i = 0; i < imageBufferData.length; i += 4) {
    redArray.push(imageBufferData[i])
    greenArray.push(imageBufferData[i + 1])
    blueArray.push(imageBufferData[i + 2])
  }

  const transposedData = new Uint8Array([...redArray, ...greenArray, ...blueArray])
  const dims = [1, 3, image.height, image.width]
  const inputTensor = new Tensor('uint8', transposedData, dims)
  return inputTensor
}
