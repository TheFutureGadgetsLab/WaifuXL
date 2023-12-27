import { env as ORTEnv, Tensor } from 'onnxruntime-web'
import { initializeSuperRes, multiUpscale } from '@/services/inference/upscaling'
import { initializeTagger, runTagger } from '@/services/inference/tagging'
import ndarray, { NdArray } from 'ndarray'

import { doGif } from '@/services/gifUtilities'
import ops from 'ndarray-ops'
import pify from 'pify'

const getPixels = pify(require('get-pixels'))
const savePixels = require('save-pixels')
const usr = require('ua-parser-js')

/**
 * Given a URI, return an ndarray of the image pixel data.
 *  - Return shape is [1, 3, height, width]
 * @param imageURI The URI
 * @param coalesce Whether to coalesce frames in a GIF
 * @returns The pixels in this image
 */
export async function imageToNdarray(imageURI: string, coalesce: boolean = true): Promise<NdArray> {
  // @ts-ignore
  let pixels: NdArray = await getPixels(imageURI) as NdArray

  if (pixels.shape.length === 4 && coalesce) {
    // animated gif with multiple frames
    const [N, W, H, C] = pixels.shape

    const numPixelsInFrame = W * H
    const data = pixels.data as number[];
    for (let i = 0; i < N; ++i) {
      const currIndex = pixels.index(i, 0, 0, 0)
      const prevIndex = pixels.index(i - 1, 0, 0, 0)

      for (let j = 0; j < numPixelsInFrame; ++j) {
        const curr = currIndex + j * C
        if (data[curr + C - 1] === 0) {
          const prev = prevIndex + j * C

          for (let k = 0; k < C; ++k) {
            data[curr + k] = data[prev + k]
          }
        }
      }
    }
    pixels.data = data;
  }

  return pixels
}


export function imageNDarrayToDataURI(data: NdArray, outputType: string): string {
  const canvas = savePixels(data, 'canvas')

  return canvas.toDataURL(outputType)
}

export function imageNDarrayToCanvas(data: NdArray): HTMLCanvasElement {
  const canvas = savePixels(data, 'canvas') as HTMLCanvasElement
  return canvas
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
    const data = imageArray.data as number[];
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

export async function fetchModel(
  filepathOrUri: string,
  setProgress: (progress: number) => void,
  startProgress: number,
  endProgress: number,
): Promise<ArrayBuffer> {
  const response = await fetch(filepathOrUri)
  const reader = response?.body?.getReader()
  const length = parseInt(response.headers.get('content-length') as string)
  const data = new Uint8Array(length)
  let received = 0

  // Loop through the response stream and extract data chunks
  while (true) {
    if(reader != null) {
      const { done, value } = await reader.read()

      if (done) {
        setProgress(1)
        break
      } else {
        // Push values to the chunk array
        data.set(value, received)
        received += value.length
        setProgress(startProgress + (received / length) * (endProgress - startProgress))
      }  
    }
  }
  return data.buffer
}

export async function initializeONNX(setProgress: (progress: number) => void): Promise<void> {
  // Set up ORT environment
  ORTEnv.wasm.simd = true
  ORTEnv.wasm.proxy = true

  const ua = usr(navigator.userAgent)
  if (ua.engine.name == 'WebKit') {
    ORTEnv.wasm.numThreads = 1
  } else {
    ORTEnv.wasm.numThreads = Math.min(navigator.hardwareConcurrency / 2, 16)
  }

  setProgress(0)
  await initializeTagger(setProgress)
  await initializeSuperRes(setProgress)
  setProgress(1)

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

  if (extension == 'gif') {
    let currentURI = uri
    for (let s = 0; s < upscaleFactor; s += 1) {
      currentURI = await doGif(currentURI, setTags)
    }

    resultURI = currentURI
  } else {
    const imageArray = await imageToNdarray(uri) as NdArray<Uint8Array>
    const tags = await runTagger(imageArray)
    setTags(tags)

    resultURI = await multiUpscale(imageArray, upscaleFactor)
  }
  return resultURI
}