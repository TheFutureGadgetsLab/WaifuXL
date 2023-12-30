import { InferenceSession, Tensor, TypedTensor } from 'onnxruntime-web'
import { ModelTags, getEmptyTags, loadTags, topK } from './utils'

export async function runTagger(session: InferenceSession, imageArray: TypedTensor<'uint8'>): Promise<ModelTags> {
  const feeds = { input: new Tensor('uint8', imageArray.data.slice(), imageArray.dims) }

  let tags = getEmptyTags()
  try {
    const output: InferenceSession.OnnxValueMapType = await session.run(feeds)

    tags = await getTopTags(output.output)
  } catch (e) {
    console.error('Failed to run tagger')
    console.error(e)
  }

  return tags
}

async function getTopTags(data: Tensor): Promise<ModelTags> {
  const tags = await loadTags()
  const flattened = Array.from(data.data as Float32Array)

  const topDesc = topK(flattened, 2000, 0, 2000, tags)
  const topChars = topK(flattened, 2000, 2000, 4000, tags)
  const rating = topK(flattened, 3, 4000, 4003, tags)

  return {
    topDesc: topDesc,
    topChars: topChars,
    rating: rating,
  }
}
