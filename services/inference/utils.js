import ndarray from 'ndarray'
import ops from 'ndarray-ops'
import { initializeTagger } from './tagging'
import { initializeSuperRes } from './upscaling'
import * as ort from 'onnxruntime-web'
import pify from 'pify'
const usr = require('ua-parser-js')
const getPixels = pify(require('get-pixels'))

/**
 * Given a URI, return an ndarray of the image pixel data.
 *  - Return shape is [1, 3, height, width]
 * @param {string} inputURI the URI
 * @returns The pixels in this image
 */
export async function imageToNdarray(imageURI) {
  let pixels = await getPixels(imageURI)

  // Transpose [W, H, C] -> [H, W, C]
  pixels = pixels.transpose(1, 0)
  const height = pixels.shape[0]
  const width = pixels.shape[1]

  // [H, W, 4] -> [1, 3, H, W]
  const img = ndarray(new Uint8Array(width * height * 3), [1, 3, height, width])
  ops.assign(img.pick(0, 0, null, null), pixels.pick(null, null, 0))
  ops.assign(img.pick(0, 1, null, null), pixels.pick(null, null, 1))
  ops.assign(img.pick(0, 2, null, null), pixels.pick(null, null, 2))

  return img
}

/**
 * Given a URI, return an ndarray of the gif pixel data.
 *  - Return shape is [1, frames, 3, height, width]
 * @param {string} inputURI the URI
 * @returns The pixels in this gif
 */
export async function gifToNdarray(gifURI, coalesce = true) {
  let results = await getPixels(gifURI)
  const { shape } = results

  if (shape.length === 4) {
    // animated gif with multiple frames
    const [frames, width, height, channels] = shape

    const numPixelsInFrame = width * height

    for (let i = 0; i < frames; ++i) {
      if (i > 0 && coalesce) {
        const currIndex = results.index(i, 0, 0, 0)
        const prevIndex = results.index(i - 1, 0, 0, 0)

        for (let j = 0; j < numPixelsInFrame; ++j) {
          const curr = currIndex + j * channels

          if (results.data[curr + channels - 1] === 0) {
            const prev = prevIndex + j * channels

            for (let k = 0; k < channels; ++k) {
              results.data[curr + k] = results.data[prev + k]
            }
          }
        }
      }
    }
  }

  results = results.transpose(0, 2, 1, 3)
  const N = results.shape[0]
  const H = results.shape[1]
  const W = results.shape[2]
  const gif = ndarray(new Uint8Array(1 * N * 3 * H * W), [1, N, 3, H, W])
  for (let i = 0; i < N; ++i) {
    ops.assign(gif.pick(0, i, 0, null, null), results.pick(i, null, null, 0))
    ops.assign(gif.pick(0, i, 1, null, null), results.pick(i, null, null, 1))
    ops.assign(gif.pick(0, i, 2, null, null), results.pick(i, null, null, 2))
  }
  return gif
}

/**
 * Sleep for the provided number of milliseconds
 * @param {Number} ms
 * @returns Promise that resolves after the sleep is complete
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Converts an ndarray of pixels ([1, 3, height, width]) to an ORT tensor ([1, 3, height, width])
 * @param {ndarray} imageArray
 * @returns {ort.Tensor} ORT Tensor
 */
export function prepareImage(imageArray) {
  const height = imageArray.shape[2]
  const width = imageArray.shape[3]
  const tensor = new ort.Tensor('uint8', imageArray.data.slice(), [1, 3, height, width])
  return { input: tensor }
}

export async function fetchModel(filepathOrUri, setProgress, startProgress, endProgress) {
  const response = await fetch(filepathOrUri)
  const reader = response.body.getReader()
  const length = parseInt(response.headers.get('content-length'))
  const data = new Uint8Array(length)
  let received = 0

  // Loop through the response stream and extract data chunks
  while (true) {
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
  return data.buffer
}

export async function initializeONNX(setProgress) {
  ort.env.wasm.simd = true
  ort.env.wasm.proxy = true

  const ua = usr(navigator.userAgent)
  if (ua.engine.name == 'WebKit') {
    ort.env.wasm.numThreads = 1
  } else {
    ort.env.wasm.numThreads = Math.min(navigator.hardwareConcurrency / 2, 16)
  }

  setProgress(0)
  await initializeTagger(setProgress)
  await initializeSuperRes(setProgress)
  setProgress(1)

  // Needed because WASM workers are created async, wait for them
  // to be ready
  await sleep(300)
}
