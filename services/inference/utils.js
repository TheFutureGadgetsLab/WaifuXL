import ndarray from 'ndarray'
import ops from 'ndarray-ops'
const ort = require('onnxruntime-web')
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
