import { parseGIF, decompressFrames } from 'gifuct-js'
import { runTagger } from './inference/tagging'
import { imageToNdarray } from './inference/utils'
import { multiUpscale } from './inference/upscaling'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'

// https://medium.com/@emma.pejko/making-gifs-in-javascript-497349bf3cc8

async function frameAdd(frame, gif, delay) {
  return new Promise(async (resolve, reject) => {
    const img = new Image()
    img.src = frame
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      gif.addFrame(img, { delay })
      resolve('Worked')
    }
  })
}

export async function doGif(inputURI, setTags) {
  const allFrames = await imageToNdarray(inputURI)
  const [N, W, H, _C] = allFrames.shape

  const promisedGif = await fetch(inputURI)
    .then((resp) => resp.arrayBuffer())
    .then((buff) => parseGIF(buff))
    .then((gif) => decompressFrames(gif, true))

  var srFrames = []
  for (let i = 0; i < N; i++) {
    const lr = sliceFrame(allFrames, i)
    // if (i == 0) {
    // setTags(await runTagger(lr))
    // }

    const sr = await multiUpscale(lr, 1)
    srFrames.push(sr)
  }

  const GIF = require('./gif.js')
  const gif = new GIF({
    workers: 8,
    quality: 1,
    width: W * 2,
    height: H * 2,
  })

  for (let i = 0; i < N; i++) {
    await frameAdd(srFrames[i], gif, promisedGif[i].delay)
  }

  return new Promise(async (resolve, reject) => {
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
  const [_N, W, H, C] = allFrames.shape

  const outFrame = ndarray(new Uint8Array(W * H * C), [W, H, C])
  ops.assign(outFrame, allFrames.pick(frameIndex, null, null, null))
  return outFrame
}
