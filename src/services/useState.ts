import default_tags from '@/services/landing_tags'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ModelTags } from './inference'
import { getImageURI } from './utils'

type ImageStoreState = {
  inputURI: string
  outputURI: string | null
  tags: ModelTags
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
  upscaleFactor: 1,
  hasntRun: true,
}

export const useImageStore = create(
  immer<ImageStoreState & ImageStoreActions>((set) => ({
    ...initialImageState,

    setInputURI: (uri) => {
      getImageURI(uri).then((dataUri) => {
        set((state) => {
          state.inputURI = dataUri
          state.hasntRun = true
          state.outputURI = null
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
  }))
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
  }))
)
