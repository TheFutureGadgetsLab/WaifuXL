import { InferenceSession, Tensor, TypedTensor } from 'onnxruntime-web'
import { fetchModel, prepareImage } from './utils'
import ndarray, { NdArray } from 'ndarray'

let taggerSession: InferenceSession | null = null

export async function runTagger(imageArray: NdArray<Uint8Array>): Promise<TagResult | undefined> {
  // @ts-ignore
  const feeds = prepareImage(imageArray, 'tagger')

  let tags: TagResult | undefined
  try {
    const output: InferenceSession.OnnxValueMapType = await taggerSession!.run(feeds)
    // @ts-ignore
    tags = getTopTags(output.output)
  } catch (e) {
    console.error('Failed to run tagger')
    console.error(e)
  }

  return tags
}

export async function initializeTagger(setProgress: (progress: number) => void): Promise<void> {
  if (taggerSession !== null) {
    return
  }

  const taggerBuf = await fetchModel('./models/tagger.onnx', setProgress, 0.5, 0.9)
  taggerSession = await InferenceSession.create(taggerBuf, {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: 'sequential', // Inter-op sequential
  })
}

interface TagResult {
  topDesc: [string, number][]
  topChars: [string, number][]
  rating: [string, number][]
}

async function getTopTags(data: TypedTensor<'float32'>): Promise<TagResult> {
  const tags = await loadTags()
  // @ts-ignore
  const flattened = ndarray(data.data, data.dims)

  const topDesc = topK(flattened, 2000, 0, 2000).map((i) => [tags[i[0]], i[1]])
  const topChars = topK(flattened, 2000, 2000, 4000).map((i) => [tags[i[0]], i[1]])
  const rating = topK(flattened, 3, 4000, 4003).map((i) => [tags[i[0]], i[1]])

  // @ts-ignore
  return { topDesc, topChars, rating }
}

async function loadTags(): Promise<string[]> {
  const response = await fetch('./tags.json')
  const tagsJson = await response.json()
  const tagsArray: string[] = tagsJson.map((tag: [number, string]) => tag[1])
  return tagsArray
}

function topK(ndarray: any, k: number, startIndex: number, stopIndex: number): [number, number][] {
  const values = ndarray.data.slice(startIndex, stopIndex)
  const indices = Array.from({ length: values.length }, (_, i) => i)
  indices.sort((a, b) => values[b] - values[a])

  const tuples = indices.map((i) => [i + startIndex, values[i]])
  // @ts-ignore
  return tuples.slice(0, k)
}
