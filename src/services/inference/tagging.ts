import { InferenceSession, Tensor, TypedTensor } from 'onnxruntime-web'
import { ModelTags, getEmptyTags, loadTags, topK } from './utils'

let taggerSession: InferenceSession | null = null

export async function runTagger(imageArray: TypedTensor<'uint8'>): Promise<ModelTags> {
  const feeds = { input: new Tensor('uint8', imageArray.data.slice(), imageArray.dims) }

  let tags = getEmptyTags()
  try {
    const output: InferenceSession.OnnxValueMapType = await taggerSession!.run(feeds)

    tags = await getTopTags(output.output)
  } catch (e) {
    console.error('Failed to run tagger')
    console.error(e)
  }

  return tags
}

export async function initializeTagger(): Promise<void> {
  if (taggerSession !== null) {
    return
  }

  taggerSession = await InferenceSession.create('./models/tagger.onnx', {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: 'sequential', // Inter-op sequential
  })
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
