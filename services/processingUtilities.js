import ndarray from 'ndarray'
import ops from 'ndarray-ops'
import { doGif } from './gifUtilities'
import { runTagger } from './inference/tagging'
import { imageToNdarray } from './inference/utils'
import { multiUpscale } from './inference/upscaling'

export function buildNdarrayFromImageOutput(data, height, width) {
  const inputArray = ndarray(data.data, data.dims || data.shape)
  const dataTensor = ndarray(new Uint8Array(width * height * 4).fill(255), [height, width, 4])
  ops.assign(dataTensor.pick(null, null, 0), inputArray.pick(0, 0, null, null))
  ops.assign(dataTensor.pick(null, null, 1), inputArray.pick(0, 1, null, null))
  ops.assign(dataTensor.pick(null, null, 2), inputArray.pick(0, 2, null, null))
  return dataTensor.data
}

export function buildNdarrayFromImage(imageData) {
  const { data, width, height } = imageData
  const dataTensor = ndarray(new Uint8Array(data), [height, width, 4])
  const dataProcessedTensor = ndarray(new Uint8Array(width * height * 3), [1, 3, height, width])
  ops.assign(dataProcessedTensor.pick(0, 0, null, null), dataTensor.pick(null, null, 0))
  ops.assign(dataProcessedTensor.pick(0, 1, null, null), dataTensor.pick(null, null, 1))
  ops.assign(dataProcessedTensor.pick(0, 2, null, null), dataTensor.pick(null, null, 2))
  return dataProcessedTensor
}

export function buildImageFromND(nd, height, width) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  var data = context.createImageData(width, height)
  data.data.set(nd)
  context.putImageData(data, 0, 0)
  return canvas.toDataURL()
}

export async function upScaleFromURI(setLoading, extension, setTags, uri, upscaleFactor) {
  setLoading(true)

  let resultURI = null
  if (extension == 'gif') {
    let currentURI = uri
    for (let s = 0; s < upscaleFactor; s += 1) {
      currentURI = await doGif(currentURI, setTags)
    }

    resultURI = currentURI
  } else {
    const imageArray = await imageToNdarray(uri)
    const tags = await runTagger(imageArray)
    setTags(tags)

    resultURI = await multiUpscale(imageArray, upscaleFactor)
  }
  setLoading(false)
  return resultURI
}

export async function upScaleGifFrameFromURI(frameData, height, width) {
  return new Promise(async (resolve, reject) => {
    const inputData = gifFlatArrayToNDArray(frameData, height, width)
    const outputImage = await multiUpscale(inputData, 1)
    resolve(outputImage)
  })
}

function gifFlatArrayToNDArray(frameData, height, width) {
  const alphaArray = ndarray(new Uint8Array(frameData), [height, width, 4])
  const noAlphaArray = ndarray(new Uint8Array(height * width * 3), [1, 3, height, width])
  ops.assign(noAlphaArray.pick(0, 0, null, null), alphaArray.pick(null, null, 0))
  ops.assign(noAlphaArray.pick(0, 1, null, null), alphaArray.pick(null, null, 1))
  ops.assign(noAlphaArray.pick(0, 2, null, null), alphaArray.pick(null, null, 2))
  return noAlphaArray
}
