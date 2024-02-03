import { InferenceSession, env as ORTEnv, Tensor, TypedTensor } from 'onnxruntime-web'

import { NdArray } from 'ndarray'
import { multiUpscale } from '@/services/inference/upscaling'
import { runTagger } from '@/services/inference/tagging'

let superSession: InferenceSession | null = null
let taggerSession: InferenceSession | null = null

export interface ModelTag {
  name: string
  prob: number
}

export interface ModelTags {
  topDesc: ModelTag[]
  topChars: ModelTag[]
  rating: ModelTag[]
}

/**
 * Converts an ndarray of pixels ([1, 3, height, width]) to an ORT tensor ([1, 3, height, width])
 * @param imageArray The ndarray of image pixels
 * @param model The model to use for preparation
 * @returns ORT Tensor
 */
export function prepareImage(imageArray: NdArray): { input: Tensor } {
  const width = imageArray.shape[0]
  const height = imageArray.shape[1]

  const data = imageArray.data as number[]
  const tensor = new Tensor('uint8', data.slice(), [width, height, 4])
  return { input: tensor }
}

async function initializeONNX(): Promise<void> {
  if (superSession !== null && taggerSession !== null) {
    return
  }

  // Set up ORT environment
  ORTEnv.wasm.simd = true
  ORTEnv.wasm.proxy = true
  ORTEnv.wasm.numThreads = Math.min(navigator.hardwareConcurrency / 2, 16)

  const onnx_options: InferenceSession.SessionOptions = {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: 'sequential', // Inter-op sequential
  }

  taggerSession = await InferenceSession.create('./models/tagger.onnx', onnx_options)
  superSession = await InferenceSession.create('./models/superRes.onnx', onnx_options)
}

export async function upScaleFromURI(
  setTags: (tags: any) => void,
  uri: string,
  upscaleFactor: number,
): Promise<string | null> {
  await initializeONNX()

  if (superSession === null) {
    throw new Error('Super resolution session not initialized')
  }
  if (taggerSession === null) {
    throw new Error('Tagger session not initialized')
  }

  let resultURI: string | null = null

  var image = await imageDataToTensor(uri)
  const tags = await runTagger(taggerSession, image)
  setTags(tags)

  resultURI = await multiUpscale(superSession, image, upscaleFactor)
  return resultURI
}

async function imageDataToTensor(imgpath: string): Promise<TypedTensor<'uint8'>> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Error loading image'))
    img.src = imgpath
  })
  const out = await Tensor.fromImage(image)
  var buf = new Uint8Array(
    out.data.map((x) => {
      return x * 255
    }),
  )

  const [, , H, W] = out.dims
  buf = buf.slice(0, H * W * 3)
  return new Tensor('uint8', buf, [1, 3, H, W])
}

export function topK(data: number[], k: number, startIndex: number, stopIndex: number, tags: string[]): ModelTag[] {
  const values = data.slice(startIndex, stopIndex)
  return values
    .map((value, index) => ({ value, index: index + startIndex }))
    .sort((a, b) => b.value - a.value)
    .slice(0, k)
    .map(({ value, index }) => ({ name: tags[index], prob: value }))
}

export async function loadTags(): Promise<string[]> {
  const response = await fetch('./tags.json')
  const tagsJson = await response.json()
  const tagsArray: string[] = tagsJson.map((tag: [number, string]) => tag[1])
  return tagsArray
}

export function getEmptyTags(): ModelTags {
  return {
    topDesc: [],
    topChars: [],
    rating: [],
  }
}
