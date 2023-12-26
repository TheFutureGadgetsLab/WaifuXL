import { imageToNdarray } from '@/services/inference/utils'
import { multiUpscale } from '@/services/inference/upscaling'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'
import { parseGIF } from 'gifuct-js'
import { runTagger } from '@/services/inference/tagging'

const GIFEncoder = require('gif-encoder-2')

export async function doGif(inputURI, setTags) {
  const allFrames = await imageToNdarray(inputURI)
  const [N, W, H, _C] = allFrames.shape

  const promisedGif = await fetch(inputURI)
    .then((resp) => resp.arrayBuffer())
    .then((buff) => parseGIF(buff))

  const encoder = new GIFEncoder(W * 2, H * 2, 'neuquant', true)
  encoder.setQuality(5)
  encoder.start()

  for (let i = 0; i < N; i++) {
    const lr = sliceFrame(allFrames, i)
    if (i == 0) {
      setTags(await runTagger(lr))
    }

    const sr = await multiUpscale(lr, 1, 'canvas')
    const ctx = sr.getContext('2d')
    encoder.setDelay(promisedGif.frames[i].delay)
    encoder.addFrame(ctx)
  }

  encoder.finish()
  const buffer = 'data:image/gif;base64,' + encoder.out.getData().toString('base64')

  return buffer
}

function sliceFrame(allFrames, frameIndex) {
  const [_N, W, H, C] = allFrames.shape

  const outFrame = ndarray(new Uint8Array(W * H * C), [W, H, C])
  ops.assign(outFrame, allFrames.pick(frameIndex, null, null, null))
  return outFrame
}
