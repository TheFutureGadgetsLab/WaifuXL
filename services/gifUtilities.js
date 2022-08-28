import { parseGIF, decompressFrames } from 'gifuct-js'
import { runTagger } from './inference/tagging'
import { gifToNdarray } from './inference/utils'
import { multiUpscale } from './inference/upscaling'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'

async function frameAdd(frame, gif, delay) {
  return new Promise(async (resolve, reject) => {
    const img = new Image()
    img.src = await multiUpscale(frame, 1)
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      gif.addFrame(img, { delay })
      resolve('Worked')
    }
  })
}

export async function doGif(inputURI, setTags) {
  const allFrames = await gifToNdarray(inputURI)
  const [ign, N, C, H, W] = allFrames.shape

  const promisedGif = await fetch(inputURI)
    .then((resp) => resp.arrayBuffer())
    .then((buff) => parseGIF(buff))
    .then((gif) => decompressFrames(gif, true))

  const tagInput = sliceFrame(allFrames, 0)
  const tags = await runTagger(tagInput)
  setTags(tags)

  return new Promise(async (resolve, reject) => {
    const GIF = require('./gif.js')
    const gif = new GIF({
      workers: 2,
      quality: 1,
      width: W * 2,
      height: H * 2,
    })

    for (let i = 0; i < N; i++) {
      const newND = sliceFrame(allFrames, i)
      await frameAdd(newND, gif, promisedGif[i].delay)
    }

    gif.on('finished', function (blob) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        resolve(reader.result)
      }
    })

    await gif.render()
  })
}

function sliceFrame(allFrames, frameIndex) {
  const [ign, N, C, H, W] = allFrames.shape

  const outFrame = ndarray(new Uint8Array(1 * C * H * W), [1, C, H, W])
  ops.assign(outFrame, allFrames.pick(null, frameIndex, null, null, null))
  return outFrame
}
