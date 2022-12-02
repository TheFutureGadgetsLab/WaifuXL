import { doGif } from './gifUtilities'
import { runTagger } from './inference/tagging'
import { imageToNdarray } from './inference/utils'
import { multiUpscale } from './inference/upscaling'

export async function upScaleFromURI(extension, setTags, uri, upscaleFactor) {
  let resultURI = null
  if (extension == 'gif') {
    let currentURI = uri
    for (let s = 0; s < upscaleFactor; s += 1) {
      currentURI = await doGif(currentURI, setTags)
    }

    resultURI = currentURI
  } else {
    const imageArray = await imageToNdarray(uri)
    // const tags = await runTagger(imageArray)
    // setTags(tags)

    resultURI = await multiUpscale(imageArray, upscaleFactor)
  }
  return resultURI
}
