import ndarray from 'ndarray'
import ops from 'ndarray-ops'
import { initializeTagger } from './tagging'
import { initializeSuperRes } from './upscaling'
const ort = require('onnxruntime-web')
const usr = require('ua-parser-js')
var getPixels = require('get-pixels')

/**
 * Given a URI, return an ndarray of the pixel data.
 *  - If the URI is an image, return shape is [1, 3, height, width]
 *  - If the URI is a gif, return shape is [frames, 3, height, width]
 *    - THIS IS NOT WORKING YET, BUT WE CAN GET THE PIXEL DATA FROM THIS
 * @param {string} inputURI the URI
 * @returns The pixels in this image
 */
export async function imageToNdarray(imageURI) {
  var img = ''
  getPixels(imageURI, function (err, pixels) {
    if (err) {
      console.log('Bad image path')
      return
    }

    // Transpose from [W, H, 4] to [H, W, 4]
    pixels = pixels.transpose(1, 0)
    let height = pixels.shape[0]
    let width = pixels.shape[1]

    // [H, W, 4] -> [1, 3, H, W]
    img = ndarray(new Uint8Array(width * height * 3), [1, 3, height, width])
    ops.assign(img.pick(0, 0, null, null), pixels.pick(null, null, 0))
    ops.assign(img.pick(0, 1, null, null), pixels.pick(null, null, 1))
    ops.assign(img.pick(0, 2, null, null), pixels.pick(null, null, 2))
  })

  // Wait for image to load
  while (img == '') {
    await sleep(0.1)
  }

  return img
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
  let data = new Uint8Array(length)
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
