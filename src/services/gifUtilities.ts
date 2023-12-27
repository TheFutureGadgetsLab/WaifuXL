import { ParsedGif, parseGIF } from 'gifuct-js'
import ndarray, { NdArray } from 'ndarray'

import { imageToNdarray } from '@/services/inference/utils'
import { multiUpscale } from '@/services/inference/upscaling'
import ops from 'ndarray-ops'
import { runTagger } from '@/services/inference/tagging'

const GIFEncoder = require('gif-encoder-2')

export async function doGif(inputURI: string, setTags: (tags: any) => void): Promise<string> {
  const allFrames: NdArray<Uint8Array> = await imageToNdarray(inputURI)
  const [N, W, H, _C] = allFrames.shape

  const promisedGif: ParsedGif = await fetch(inputURI)
    .then((resp) => resp.arrayBuffer())
    .then((buff) => parseGIF(buff))

  const encoder = new GIFEncoder(W * 2, H * 2, 'neuquant', true)
  encoder.setQuality(5)
  encoder.start()

  for (let i = 0; i < N; i++) {
    const lr: NdArray<Uint8Array> = sliceFrame(allFrames, i)
    if (i === 0) {
      setTags(await runTagger(lr))
    }

    const sr = await multiUpscale(lr, 1, 'canvas')
    const ctx = sr.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }
    // @ts-ignore
    encoder.setDelay(promisedGif.frames[i].delay)
    encoder.addFrame(ctx)
  }

  encoder.finish()
  const buffer = 'data:image/gif;base64,' + encoder.out.getData().toString('base64')

  return buffer
}

function sliceFrame(allFrames: NdArray<Uint8Array>, frameIndex: number): NdArray<Uint8Array> {
  const [_N, W, H, C] = allFrames.shape

  const outFrame = ndarray(new Uint8Array(W * H * C), [W, H, C])
  ops.assign(outFrame, allFrames.pick(frameIndex, null, null, null))
  return outFrame
}
