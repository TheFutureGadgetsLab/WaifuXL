import ndarray, { NdArray } from 'ndarray'
import ops from 'ndarray-ops'
import { InferenceSession, env as ORTEnv, Tensor, TypedTensor } from 'onnxruntime-web'

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

// Constants
const CHUNK_SIZE = 256,
  PAD_SIZE = 32

// Session management
let superSession: InferenceSession | null = null
let taggerSession: InferenceSession | null = null

async function initializeONNX(): Promise<void> {
  if (superSession && taggerSession) return

  ORTEnv.wasm.proxy = true
  ORTEnv.wasm.numThreads = Math.min(navigator.hardwareConcurrency / 2, 16)
  ORTEnv.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/`

  const onnxOptions: InferenceSession.SessionOptions = {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: 'sequential',
  }

  ;[taggerSession, superSession] = await Promise.all([
    InferenceSession.create('./models/tagger.onnx', onnxOptions),
    InferenceSession.create('./models/superRes.onnx', onnxOptions),
  ])
}

// Main pipeline function
export async function upscaleAndTag(
  setTags: (tags: ModelTags) => void,
  uri: string,
  upscaleFactor: number
): Promise<string> {
  await initializeONNX()
  if (!superSession || !taggerSession) throw new Error('ONNX sessions not initialized')

  const tensor = await imageDataToTensor(uri)
  setTags(await runTagger(taggerSession, tensor))
  return await multiUpscale(superSession, tensor, upscaleFactor)
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
    topDesc: getTopK(flattened, 2000, 0, 2000, tags),
    topChars: getTopK(flattened, 2000, 2000, 4000, tags),
    rating: getTopK(flattened, 3, 4000, 4003, tags),
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

async function loadTags(): Promise<string[]> {
  const response = await fetch('./tags.json')
  return (await response.json()).map((tag: [number, string]) => tag[1])
}

// Upscaling functions
async function multiUpscale(
  session: InferenceSession,
  imageArray: TypedTensor<'uint8'>,
  upscaleFactor: number
): Promise<string> {
  console.time('Upscaling')
  let outArr: NdArray<Uint8Array> = ndarray(new Uint8Array(imageArray.data), imageArray.dims as number[])
    .pick(0, null, null, null)
    .transpose(2, 1, 0)

  for (let s = 0; s < upscaleFactor; s++) {
    outArr = await upscaleFrame(session, outArr)
  }

  console.timeEnd('Upscaling')
  return imgToDataURI(outArr)
}

async function upscaleFrame(session: InferenceSession, imageArray: NdArray<Uint8Array>): Promise<NdArray<Uint8Array>> {
  const [inImgW, inImgH] = imageArray.shape
  const [outImgW, outImgH] = [inImgW * 2, inImgH * 2]
  const [numChunksWidth, numChunksHeight] = [Math.ceil(inImgW / CHUNK_SIZE), Math.ceil(inImgH / CHUNK_SIZE)]
  const [chunkWidth, chunkHeight] = [Math.floor(inImgW / numChunksWidth), Math.floor(inImgH / numChunksHeight)]

  const outArr = ndarray(new Uint8Array(outImgW * outImgH * 4), [outImgW, outImgH, 4])

  for (let r = 0; r < numChunksHeight; r++) {
    for (let c = 0; c < numChunksWidth; c++) {
      const [x, y] = [c * chunkWidth, r * chunkHeight]
      const [xStart, yStart] = [Math.max(0, x - PAD_SIZE), Math.max(0, y - PAD_SIZE)]
      const [inW, inH] = [
        Math.min(xStart + chunkWidth + PAD_SIZE * 2, inImgW) - xStart,
        Math.min(yStart + chunkHeight + PAD_SIZE * 2, inImgH) - yStart,
      ]
      const [outW, outH] = [2 * (Math.min(inImgW, x + chunkWidth) - x), 2 * (Math.min(inImgH, y + chunkHeight) - y)]

      const inSlice = imageArray.lo(xStart, yStart, 0).hi(inW, inH, 4)
      const subArr = ndarray(new Uint8Array(inW * inH * 4), inSlice.shape)
      ops.assign(subArr, inSlice)

      const chunkData = await runSuperRes(session, subArr)
      if (!chunkData) continue

      const chunkArr = ndarray(new Uint8Array(chunkData.data as unknown as ArrayBufferLike), [...chunkData.dims])
      const chunkSlice = chunkArr.lo((x - xStart) * 2, (y - yStart) * 2, 0).hi(outW, outH, 4)
      const outSlice = outArr.lo(x * 2, y * 2, 0).hi(outW, outH, 4)
      ops.assign(outSlice, chunkSlice)
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
function imgToDataURI(img: NdArray<Uint8Array>): string {
  const [width, height] = img.shape
  const imgData = img.data
  const [strideWidth, strideHeight] = [img.stride[0] || 4, img.stride[1] || width * (img.stride[0] || 4)]

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
