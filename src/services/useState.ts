import { ModelTags } from './inference/tagging'
import { create } from 'zustand'
import default_tags from '@/services/landing_tags'

type ImageStoreState = {
  inputURI: string
  outputURI: string | null
  tags: ModelTags
  fileName: string
  extension: string
  upscaleFactor: number
  hasntRun: boolean

  setInputURI: (uri: string) => void
  setUpscaleFactor: (newFactor: number) => void
  setOutputURI: (uri: string) => void
  setTags: (newTags: ModelTags) => void
  setFileName: (newFilename: string) => void
}

// Define the store with its state and actions
const useImageStore = create<ImageStoreState>((set) => ({
  inputURI: './images/senjougahara.webp',
  outputURI: './images/senjougahara_2x.webp',
  tags: default_tags,
  fileName: 'example',
  extension: 'webp',
  upscaleFactor: 1,
  hasntRun: true,

  setInputURI: (uri: string) => {
    set(() => ({ inputURI: uri, outputURI: null, hasntRun: true }))

    // Assuming useAppStateStore is correctly typed and exists in the same scope
    useAppStateStore.setState({ downloadReady: false })

    if (uri.startsWith('data:image/gif')) {
      set(() => ({ extension: 'gif' }))
    } else {
      set(() => ({ extension: 'png' }))
    }
  },
  setUpscaleFactor: (newFactor: number) => set(() => ({ upscaleFactor: newFactor })),
  setOutputURI: (uri: string) => set(() => ({ outputURI: uri, hasntRun: false })),
  setTags: (newTags: ModelTags) => set(() => ({ tags: newTags })),
  setFileName: (newFilename: string) => set(() => ({ fileName: newFilename })),
}))

// Define the type for the state in the store
type AppStateStoreState = {
  inputModalOpen: boolean
  mobile: boolean
  errorMessage: string | null
  running: boolean
  downloadReady: boolean
  feedbackMessage: string | null
  selectedPreset: string

  setInputModalOpen: (newInputModalOpen: boolean) => void
  setMobile: (newMobile: boolean) => void
  setErrorMessage: (newError: string | null) => void
  setRunning: (newRunning: boolean) => void
  setDownloadReady: (newDownloadReady: boolean) => void
  setFeedbackMessage: (newFeedbackMessage: string | null) => void
  setSelectedPreset: (newSelectedPreset: string) => void
}

// Define the store with its state and actions
const useAppStateStore = create<AppStateStoreState>((set) => ({
  inputModalOpen: false,
  mobile: false,
  errorMessage: null,
  running: false,
  downloadReady: false,
  feedbackMessage: null,
  selectedPreset: 'senjougahara|https://i.imgur.com/cMX8YcK.jpg',

  setInputModalOpen: (newInputModalOpen: boolean) => set(() => ({ inputModalOpen: newInputModalOpen })),
  setMobile: (newMobile: boolean) => set(() => ({ mobile: newMobile })),
  setErrorMessage: (newError: string | null) => set(() => ({ errorMessage: newError })),
  setRunning: (newRunning: boolean) => set(() => ({ running: newRunning })),
  setDownloadReady: (newDownloadReady: boolean) => set(() => ({ downloadReady: newDownloadReady })),
  setFeedbackMessage: (newFeedbackMessage: string | null) => set(() => ({ feedbackMessage: newFeedbackMessage })),
  setSelectedPreset: (newSelectedPreset: string) => set(() => ({ selectedPreset: newSelectedPreset })),
}))

export { useImageStore, useAppStateStore }
