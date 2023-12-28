import { create } from 'zustand'
import default_tags from '@/services/landing_tags'
interface tagsType {
  topChars: {
    0: string
    1: number
  }[]
  topDesc: {
    0: string
    1: number
  }[]
  rating: {
    0: string
    1: number
  }[]
  [key: string]: {
    0: string
    1: number
  }[]
}
// Define the type for the state in the store
type ImageStoreState = {
  inputURI: string
  outputURI: string | null
  tags: tagsType | null
  fileName: string
  extension: string
  upscaleFactor: number
  hasntRun: boolean
  tempURI: string
  tempFileName: string

  setInputURI: (uri: string) => void
  setUpscaleFactor: (newFactor: number) => void
  setOutputURI: (uri: string) => void
  setTags: (newTags: tagsType | null) => void
  setFileName: (newFilename: string) => void
  setTempURI: (newTempUri: string) => void
  setTempFileName: (newTempFileName: string) => void
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
  tempURI: './images/senjougahara.webp',
  tempFileName: 'example',

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
  setTags: (newTags: tagsType | null) => set(() => ({ tags: newTags })),
  setFileName: (newFilename: string) => set(() => ({ fileName: newFilename })),
  setTempURI: (newTempUri: string) => set(() => ({ tempURI: newTempUri })),
  setTempFileName: (newTempFileName: string) => set(() => ({ tempFileName: newTempFileName })),
}))

// Define the type for the state in the store
type AppStateStoreState = {
  loadProg: number
  inputModalOpen: boolean
  mobile: boolean
  errorMessage: string | null
  running: boolean
  downloadReady: boolean
  feedbackMessage: string | null
  isUploading: boolean
  selectedPreset: string

  setInputModalOpen: (newInputModalOpen: boolean) => void
  setMobile: (newMobile: boolean) => void
  setErrorMessage: (newError: string | null) => void
  setRunning: (newRunning: boolean) => void
  setLoadProg: (newProg: number) => void
  setDownloadReady: (newDownloadReady: boolean) => void
  setFeedbackMessage: (newFeedbackMessage: string | null) => void
  setIsUploading: (newIsUploading: boolean) => void
  setSelectedPreset: (newSelectedPreset: string) => void
}

// Define the store with its state and actions
const useAppStateStore = create<AppStateStoreState>((set) => ({
  loadProg: -1,
  inputModalOpen: false,
  mobile: false,
  errorMessage: null,
  running: false,
  downloadReady: false,
  feedbackMessage: null,
  isUploading: false,
  selectedPreset: 'senjougahara|https://i.imgur.com/cMX8YcK.jpg',

  setInputModalOpen: (newInputModalOpen: boolean) => set(() => ({ inputModalOpen: newInputModalOpen })),
  setMobile: (newMobile: boolean) => set(() => ({ mobile: newMobile })),
  setErrorMessage: (newError: string | null) => set(() => ({ errorMessage: newError })),
  setRunning: (newRunning: boolean) => set(() => ({ running: newRunning })),
  setLoadProg: (newProg: number) => set(() => ({ loadProg: newProg })),
  setDownloadReady: (newDownloadReady: boolean) => set(() => ({ downloadReady: newDownloadReady })),
  setFeedbackMessage: (newFeedbackMessage: string | null) => set(() => ({ feedbackMessage: newFeedbackMessage })),
  setIsUploading: (newIsUploading: boolean) => set(() => ({ isUploading: newIsUploading })),
  setSelectedPreset: (newSelectedPreset: string) => set(() => ({ selectedPreset: newSelectedPreset })),
}))

export { useImageStore, useAppStateStore }
