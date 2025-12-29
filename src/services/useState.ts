import default_tags from '@/services/landing_tags'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ModelTags } from './inference'
import { getImageURI } from './utils'

interface ImageStoreState {
  inputURI: string
  outputURI: string | null
  tags: ModelTags
  upscaleFactor: number
}

interface ImageStoreActions {
  setInputURI: (uri: string | File) => void
  setUpscaleFactor: (upscaleFactor: number) => void
  setOutputURI: (outputURI: string) => void
  setTags: (tags: ModelTags) => void
  resetOutput: () => void
}

const initialImageState: ImageStoreState = {
  inputURI: './images/senjougahara.webp',
  outputURI: './images/senjougahara_2x.webp',
  tags: default_tags,
  upscaleFactor: 1,
}

export const useImageStore = create(
  immer<ImageStoreState & ImageStoreActions>((set) => ({
    ...initialImageState,

    setInputURI: (uri) => {
      getImageURI(uri).then((dataUri) => {
        set((state) => {
          state.inputURI = dataUri
          state.outputURI = null
        })
      })
    },
    setUpscaleFactor: (upscaleFactor) =>
      set((state) => {
        state.upscaleFactor = upscaleFactor
      }),
    setOutputURI: (outputURI) =>
      set((state) => {
        state.outputURI = outputURI
      }),
    setTags: (tags) =>
      set((state) => {
        state.tags = tags
      }),
    resetOutput: () =>
      set((state) => {
        state.outputURI = null
      }),
  }))
)

interface AppStateStoreState {
  inputModalOpen: boolean
  running: boolean
  selectedPreset: string
  shouldFlashSidebarButton: boolean
  shouldFlashDownloadButton: boolean
}

interface AppStateStoreActions {
  setInputModalOpen: (inputModalOpen: boolean) => void
  setRunning: (running: boolean) => void
  setSelectedPreset: (selectedPreset: string) => void
  setShouldFlashSidebarButton: (shouldFlash: boolean) => void
  setShouldFlashDownloadButton: (shouldFlash: boolean) => void
}

const initialAppState: AppStateStoreState = {
  inputModalOpen: false,
  running: false,
  selectedPreset: 'Senjougahara|https://i.imgur.com/cMX8YcK.jpg',
  shouldFlashSidebarButton: false,
  shouldFlashDownloadButton: false,
}

export const useAppStateStore = create(
  immer<AppStateStoreState & AppStateStoreActions>((set) => ({
    ...initialAppState,

    setInputModalOpen: (inputModalOpen) =>
      set((state) => {
        state.inputModalOpen = inputModalOpen
      }),
    setRunning: (running) =>
      set((state) => {
        state.running = running
      }),
    setSelectedPreset: (selectedPreset) =>
      set((state) => {
        state.selectedPreset = selectedPreset
      }),
    setShouldFlashSidebarButton: (shouldFlash) =>
      set((state) => {
        state.shouldFlashSidebarButton = shouldFlash
      }),
    setShouldFlashDownloadButton: (shouldFlash) =>
      set((state) => {
        state.shouldFlashDownloadButton = shouldFlash
      }),
  }))
)
