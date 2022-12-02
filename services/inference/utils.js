import ndarray from 'ndarray'
import { initializeTagger } from './tagging'
import { initializeSuperRes } from './upscaling'
import * as ort from 'onnxruntime-web'
import pify from 'pify'
const usr = require('ua-parser-js')
const getPixels = pify(require('get-pixels'))
var savePixels = require('save-pixels')

/**
 * Given a URI, return an ndarray of the image pixel data.
 *  - Return shape is [1, 3, height, width]
 * @param {string} inputURI the URI
 * @returns The pixels in this image
 */
export async function imageToNdarray(imageURI, coalesce = true) {
  let pixels = await getPixels(imageURI)

  if (pixels.shape.length === 4) {
    // animated gif with multiple frames
    const [N, W, H, C] = pixels.shape

    const numPixelsInFrame = W * H

    for (let i = 0; i < N; ++i) {
      if (i > 0 && coalesce) {
        const currIndex = pixels.index(i, 0, 0, 0)
        const prevIndex = pixels.index(i - 1, 0, 0, 0)

        for (let j = 0; j < numPixelsInFrame; ++j) {
          const curr = currIndex + j * C

          if (pixels.data[curr + C - 1] === 0) {
            const prev = prevIndex + j * C

            for (let k = 0; k < C; ++k) {
              pixels.data[curr + k] = pixels.data[prev + k]
            }
          }
        }
      }
    }
  }

  return pixels
}

export function imageNDarrayToDataURI(data) {
  const canvas = savePixels(data, 'canvas')
  return canvas.toDataURL('image/png')
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
  const width = imageArray.shape[0]
  const height = imageArray.shape[1]
  const tensor = new ort.Tensor('uint8', imageArray.data.slice(), [width, height, 4])
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
