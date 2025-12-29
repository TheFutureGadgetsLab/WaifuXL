import ndarray, { NdArray } from 'ndarray'
import ops from 'ndarray-ops'
import { InferenceSession, env as ORTEnv, Tensor, TypedTensor } from 'onnxruntime-web'
import { INFERENCE_CONFIG } from '@/constants'
import type { ProgressInfo } from './stores/processingStore'
import type { UpscaleFactor } from './stores/imageStore'

// Types
export interface ModelTag {
  name: string
  prob: number
}
export interface ModelTags {
  topDesc: ModelTag[]
  topChars: ModelTag[]
  rating: ModelTag[]
}

// Progress callback type
export type ProgressCallback = (info: ProgressInfo) => void

// Result from the pure upscale function
export interface UpscaleResult {
  outputURI: string
  tags: ModelTags
}

// Tags callback type - called when tags are ready (before upscaling completes)
export type TagsCallback = (tags: ModelTags) => void

// Options for upscaling
export interface UpscaleOptions {
  onProgress?: ProgressCallback
  onTags?: TagsCallback
  signal?: AbortSignal
}

// Image ndarray with guaranteed stride structure [width, height, channels]
interface ImageNdArray extends NdArray<Uint8Array> {
  stride: [number, number, number]
  shape: [number, number, number]
}

// Constants
const { CHUNK_SIZE, PAD_SIZE, TAG_INDICES } = INFERENCE_CONFIG

// Chunk processing types
interface ChunkBounds {
  x: number
  y: number
  xStart: number
  yStart: number
  inW: number
  inH: number
  outW: number
  outH: number
}

// Session management
let superSession: InferenceSession | null = null
let taggerSession: InferenceSession | null = null

export function resetONNX(): void {
  superSession = null
  taggerSession = null
}

// Helper to check for abort
function checkAbort(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('Operation was aborted', 'AbortError')
  }
}

async function initializeONNX(onProgress?: ProgressCallback): Promise<void> {
  if (superSession && taggerSession) return

  onProgress?.({ stage: 'loading-models', progress: 0 })

  ORTEnv.wasm.proxy = true
  ORTEnv.wasm.numThreads = Math.min(navigator.hardwareConcurrency / 2, 16)
  ORTEnv.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/'

  const onnxOptions: InferenceSession.SessionOptions = {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: 'sequential',
  }

  onProgress?.({ stage: 'loading-models', progress: 25 })

    ;[taggerSession, superSession] = await Promise.all([
      InferenceSession.create('./models/tagger.onnx', onnxOptions),
      InferenceSession.create('./models/superRes.onnx', onnxOptions),
    ])

  onProgress?.({ stage: 'loading-models', progress: 100 })
}

// Pure upscale function - returns result without side effects
export async function upscaleImage(
  uri: string,
  upscaleFactor: UpscaleFactor,
  options?: UpscaleOptions
): Promise<UpscaleResult> {
  const { onProgress, onTags, signal } = options ?? {}

  // Check abort before starting
  checkAbort(signal)

  // Initialize ONNX
  await initializeONNX(onProgress)
  if (!superSession || !taggerSession) throw new Error('ONNX sessions not initialized')

  checkAbort(signal)

  // Load image
  onProgress?.({ stage: 'loading-image', progress: 0 })
  const tensor = await imageDataToTensor(uri)
  onProgress?.({ stage: 'loading-image', progress: 100 })

  checkAbort(signal)

  // Run tagger
  onProgress?.({ stage: 'tagging', progress: 0 })
  const tags = await runTagger(taggerSession, tensor)
  onProgress?.({ stage: 'tagging', progress: 100 })

  // Report tags immediately so UI can display them during upscaling
  onTags?.(tags)

  checkAbort(signal)

  // Run upscaling
  const outputURI = await multiUpscale(superSession, tensor, upscaleFactor, onProgress, signal)

  return { outputURI, tags }
}

// Tagging functions
async function runTagger(session: InferenceSession, imageArray: TypedTensor<'uint8'>): Promise<ModelTags> {
  try {
    const output = await session.run({ input: new Tensor('uint8', imageArray.data.slice(), imageArray.dims) })
    return getTopTags(output.output as Tensor)
  } catch (error) {
    console.error('Failed to run tagger:', error)
    return { topDesc: [], topChars: [], rating: [] }
  }
}

async function getTopTags(data: Tensor): Promise<ModelTags> {
  const tags = await loadTags()
  const flattened = Array.from(data.data as Float32Array)
  return {
    topDesc: getTopK(flattened, TAG_INDICES.DESCRIPTORS_END, TAG_INDICES.DESCRIPTORS_START, TAG_INDICES.DESCRIPTORS_END, tags),
    topChars: getTopK(flattened, TAG_INDICES.CHARACTERS_END - TAG_INDICES.CHARACTERS_START, TAG_INDICES.CHARACTERS_START, TAG_INDICES.CHARACTERS_END, tags),
    rating: getTopK(flattened, TAG_INDICES.RATINGS_END - TAG_INDICES.RATINGS_START, TAG_INDICES.RATINGS_START, TAG_INDICES.RATINGS_END, tags),
  }
}

function getTopK(data: number[], k: number, startIndex: number, stopIndex: number, tags: string[]): ModelTag[] {
  return data
    .slice(startIndex, stopIndex)
    .map((value, index) => ({ value, index: index + startIndex }))
    .sort((a, b) => b.value - a.value)
    .slice(0, k)
    .map(({ value, index }) => ({ name: tags[index], prob: value }))
}

let cachedTags: string[] | null = null

async function loadTags(): Promise<string[]> {
  if (cachedTags) return cachedTags
  const response = await fetch('./tags.json')
  const tags: string[] = (await response.json()).map((tag: [number, string]) => tag[1])
  cachedTags = tags
  return tags
}

// Chunk processing helpers
function calculateChunkBounds(
  col: number,
  row: number,
  chunkWidth: number,
  chunkHeight: number,
  imgWidth: number,
  imgHeight: number
): ChunkBounds {
  const x = col * chunkWidth
  const y = row * chunkHeight
  const xStart = Math.max(0, x - PAD_SIZE)
  const yStart = Math.max(0, y - PAD_SIZE)

  return {
    x,
    y,
    xStart,
    yStart,
    inW: Math.min(xStart + chunkWidth + PAD_SIZE * 2, imgWidth) - xStart,
    inH: Math.min(yStart + chunkHeight + PAD_SIZE * 2, imgHeight) - yStart,
    outW: 2 * (Math.min(imgWidth, x + chunkWidth) - x),
    outH: 2 * (Math.min(imgHeight, y + chunkHeight) - y),
  }
}

function extractChunkWithPadding(image: ImageNdArray, bounds: ChunkBounds): NdArray<Uint8Array> {
  const { xStart, yStart, inW, inH } = bounds
  const inSlice = image.lo(xStart, yStart, 0).hi(inW, inH, 4)
  const subArr = ndarray(new Uint8Array(inW * inH * 4), inSlice.shape)
  ops.assign(subArr, inSlice)
  return subArr
}

function tensorDataToUint8Array(data: Tensor['data']): Uint8Array {
  if (data instanceof Uint8Array) return data
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
  throw new Error('Unexpected tensor data type')
}

function blendChunkResult(output: ImageNdArray, chunkData: Tensor, bounds: ChunkBounds): void {
  const { x, y, xStart, yStart, outW, outH } = bounds
  const chunkArr = ndarray(tensorDataToUint8Array(chunkData.data), [...chunkData.dims])
  const chunkSlice = chunkArr.lo((x - xStart) * 2, (y - yStart) * 2, 0).hi(outW, outH, 4)
  const outSlice = output.lo(x * 2, y * 2, 0).hi(outW, outH, 4)
  ops.assign(outSlice, chunkSlice)
}

// Upscaling functions
async function multiUpscale(
  session: InferenceSession,
  imageArray: TypedTensor<'uint8'>,
  upscaleFactor: number,
  onProgress?: ProgressCallback,
  signal?: AbortSignal
): Promise<string> {
  console.time('Upscaling')
  let outArr = ndarray(new Uint8Array(imageArray.data), imageArray.dims as number[])
    .pick(0, null, null, null)
    .transpose(2, 1, 0) as ImageNdArray

  for (let s = 0; s < upscaleFactor; s++) {
    checkAbort(signal)
    outArr = await upscaleFrame(session, outArr, onProgress, signal, s + 1, upscaleFactor)
  }

  console.timeEnd('Upscaling')
  return imgToDataURI(outArr)
}

async function upscaleFrame(
  session: InferenceSession,
  imageArray: ImageNdArray,
  onProgress?: ProgressCallback,
  signal?: AbortSignal,
  currentIteration?: number,
  totalIterations?: number
): Promise<ImageNdArray> {
  const [inImgW, inImgH] = imageArray.shape
  const [outImgW, outImgH] = [inImgW * 2, inImgH * 2]
  const [numChunksWidth, numChunksHeight] = [Math.ceil(inImgW / CHUNK_SIZE), Math.ceil(inImgH / CHUNK_SIZE)]
  const [chunkWidth, chunkHeight] = [Math.floor(inImgW / numChunksWidth), Math.floor(inImgH / numChunksHeight)]

  const totalChunks = numChunksWidth * numChunksHeight
  let currentChunk = 0

  const outArr = ndarray(new Uint8Array(outImgW * outImgH * 4), [outImgW, outImgH, 4]) as ImageNdArray

  for (let r = 0; r < numChunksHeight; r++) {
    for (let c = 0; c < numChunksWidth; c++) {
      checkAbort(signal)

      const bounds = calculateChunkBounds(c, r, chunkWidth, chunkHeight, inImgW, inImgH)
      const subArr = extractChunkWithPadding(imageArray, bounds)

      const chunkData = await runSuperRes(session, subArr)
      if (!chunkData) continue

      blendChunkResult(outArr, chunkData, bounds)

      currentChunk++
      onProgress?.({
        stage: 'upscaling',
        progress: Math.round((currentChunk / totalChunks) * 100),
        currentChunk,
        totalChunks,
        currentIteration,
        totalIterations,
      })
    }
  }

  return outArr
}

async function runSuperRes(session: InferenceSession, imageArray: NdArray): Promise<Tensor | undefined> {
  try {
    const output = await session.run({
      input: new Tensor('uint8', (imageArray.data as number[]).slice(), imageArray.shape),
    })
    return output.output
  } catch (e) {
    console.error('Failed to run super resolution:', e)
    return undefined
  }
}

// Helper functions
function imgToDataURI(img: ImageNdArray): string {
  const [width, height] = img.shape
  const imgData = img.data
  const [strideWidth, strideHeight] = img.stride

  const buffer = new Uint8ClampedArray(width * height * 4)
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const imgIndex = c * strideWidth + r * strideHeight
      buffer.set(imgData.subarray(imgIndex, imgIndex + 4), (r * width + c) * 4)
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.putImageData(new ImageData(buffer, width, height), 0, 0)
  }
  return canvas.toDataURL('image/png')
}

async function imageDataToTensor(imgpath: string): Promise<TypedTensor<'uint8'>> {
  const image = await loadImage(imgpath)
  const tensor = await Tensor.fromImage(image)
  const [, , H, W] = tensor.dims
  return new Tensor('uint8', new Uint8Array(tensor.data.map((x) => x * 255)).slice(0, H * W * 3), [1, 3, H, W])
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Error loading image'))
    img.src = src
  })
}
