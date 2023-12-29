import { InferenceSession, Tensor, TypedTensor } from 'onnxruntime-web'

import { NdArray } from 'ndarray'
import { prepareImage } from './utils'

export interface ModelTag {
  name: string
  prob: number
}

export interface ModelTags {
  topDesc: ModelTag[]
  topChars: ModelTag[]
  rating: ModelTag[]
}

export function getEmptyTags(): ModelTags {
  return {
    topDesc: [],
    topChars: [],
    rating: [],
  }
}

let taggerSession: InferenceSession | null = null

export async function runTagger(imageArray: NdArray<Uint8Array>): Promise<ModelTags> {
  const feeds = prepareImage(imageArray, 'tagger')

  let tags = getEmptyTags()
  try {
    const output: InferenceSession.OnnxValueMapType = await taggerSession!.run(feeds)

    tags = await getTopTags(output.output as TypedTensor<'float32'>)
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

function topK(data: number[], k: number, startIndex: number, stopIndex: number, tags: string[]): ModelTag[] {
  const values = data.slice(startIndex, stopIndex)
  return values
    .map((value, index) => ({ value, index: index + startIndex }))
    .sort((a, b) => b.value - a.value)
    .slice(0, k)
    .map(({ value, index }) => ({ name: tags[index], prob: value }))
}

async function loadTags(): Promise<string[]> {
  const response = await fetch('./tags.json')
  const tagsJson = await response.json()
  const tagsArray: string[] = tagsJson.map((tag: [number, string]) => tag[1])
  return tagsArray
}
