import default_tags from '@/services/landing_tags'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ModelTags } from './inference'

type InputType = string | File
type DataURIResult = { dataUri: string; filename: string }

type ImageStoreState = {
  inputURI: string
  outputURI: string | null
  tags: ModelTags
  fileName: string
  upscaleFactor: number
  hasntRun: boolean
}

type ImageStoreActions = {
  setInputURI: (uri: string | File) => void
  setUpscaleFactor: (newFactor: number) => void
  setOutputURI: (uri: string) => void
  setTags: (newTags: ModelTags) => void
}

const initialImageState: ImageStoreState = {
  inputURI: './images/senjougahara.webp',
  outputURI: './images/senjougahara_2x.webp',
  tags: default_tags,
  fileName: 'example',
  upscaleFactor: 1,
  hasntRun: true,
}

export const useImageStore = create(
  immer<ImageStoreState & ImageStoreActions>((set) => ({
    ...initialImageState,

    setInputURI: (uri) => {
      getDataURIFromInput(uri).then(({ dataUri, filename }) => {
        set((state) => {
          state.inputURI = dataUri
          state.hasntRun = true
          state.outputURI = null
          state.fileName = filename
        })
        useAppStateStore.setState({ downloadReady: false })
      })
    },

    setUpscaleFactor: (newFactor) =>
      set((state) => {
        state.upscaleFactor = newFactor
      }),
    setOutputURI: (uri) =>
      set((state) => {
        state.outputURI = uri
        state.hasntRun = false
      }),
    setTags: (newTags) =>
      set((state) => {
        state.tags = newTags
      }),
  })),
)

type AppStateStoreState = {
  inputModalOpen: boolean
  errorMessage: string | null
  running: boolean
  downloadReady: boolean
  selectedPreset: string
}

type AppStateStoreActions = {
  setInputModalOpen: (newInputModalOpen: boolean) => void
  setErrorMessage: (newError: string | null) => void
  setRunning: (newRunning: boolean) => void
  setDownloadReady: (newDownloadReady: boolean) => void
  setSelectedPreset: (newSelectedPreset: string) => void
}

const initialAppState: AppStateStoreState = {
  inputModalOpen: false,
  errorMessage: null,
  running: false,
  downloadReady: false,
  selectedPreset: 'Senjougahara|https://i.imgur.com/cMX8YcK.jpg',
}

export const useAppStateStore = create(
  immer<AppStateStoreState & AppStateStoreActions>((set) => ({
    ...initialAppState,

    setInputModalOpen: (newInputModalOpen) =>
      set((state) => {
        state.inputModalOpen = newInputModalOpen
      }),
    setErrorMessage: (newError) =>
      set((state) => {
        state.errorMessage = newError
      }),
    setRunning: (newRunning) =>
      set((state) => {
        state.running = newRunning
      }),
    setDownloadReady: (newDownloadReady) =>
      set((state) => {
        state.downloadReady = newDownloadReady
      }),
    setSelectedPreset: (newSelectedPreset) =>
      set((state) => {
        state.selectedPreset = newSelectedPreset
      }),
  })),
)

async function getDataURIFromInput(input: InputType): Promise<DataURIResult> {
  const filename = 'superRes'

  if (input instanceof File) {
    return { dataUri: URL.createObjectURL(input), filename }
  }

  if (typeof input === 'string') {
    const dataUri = isValidHttpUrl(input)
      ? URL.createObjectURL(await (await fetch(input)).blob())
      : await new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            canvas.getContext('2d')?.drawImage(img, 0, 0)
            resolve(canvas.toDataURL())
          }
          img.onerror = () => reject(new Error('Image load error'))
          img.src = input
        })

    return { dataUri, filename }
  }

  throw new Error('Invalid input type')
}

function isValidHttpUrl(url: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol)
  } catch {
    return false
  }
}
