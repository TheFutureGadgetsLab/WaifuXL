import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DEFAULT_IMAGES } from '@/constants'
import { ModelTags } from '../inference'
import default_tags from '../landing_tags'

// Types
export type UpscaleFactor = 1 | 2 | 3

export interface ImageStoreState {
  inputURI: string | null
  outputURI: string | null
  tags: ModelTags
  upscaleFactor: UpscaleFactor
}

export interface ImageStoreActions {
  setInputURI: (uri: string) => void
  setOutputURI: (uri: string) => void
  setTags: (tags: ModelTags) => void
  clearTags: () => void
  setUpscaleFactor: (factor: UpscaleFactor) => void
  reset: () => void
  clearOutput: () => void
}

const initialState: ImageStoreState = {
  inputURI: DEFAULT_IMAGES.input,
  outputURI: DEFAULT_IMAGES.output,
  tags: default_tags,
  upscaleFactor: 1,
}

const emptyTags: ModelTags = {
  topDesc: [],
  topChars: [],
  rating: [],
}

const canRevokeObjectUrl = typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function'

function revokeObjectUrl(uri: string | null): void {
  if (canRevokeObjectUrl && uri?.startsWith('blob:')) {
    URL.revokeObjectURL(uri)
  }
}

export const useImageStore = create(
  immer<ImageStoreState & ImageStoreActions>((set) => ({
    ...initialState,

    setInputURI: (uri) =>
      set((state) => {
        if (state.inputURI && state.inputURI !== uri) {
          revokeObjectUrl(state.inputURI)
        }
        state.inputURI = uri
        state.outputURI = null
        state.tags = emptyTags
      }),

    setOutputURI: (uri) =>
      set((state) => {
        state.outputURI = uri
      }),

    setTags: (tags) =>
      set((state) => {
        state.tags = tags
      }),

    clearTags: () =>
      set((state) => {
        state.tags = emptyTags
      }),

    setUpscaleFactor: (factor) =>
      set((state) => {
        if (![1, 2, 3].includes(factor)) return
        state.upscaleFactor = factor
      }),

    reset: () =>
      set((state) => {
        revokeObjectUrl(state.inputURI)
        state.inputURI = initialState.inputURI
        state.outputURI = initialState.outputURI
        state.tags = initialState.tags
        state.upscaleFactor = initialState.upscaleFactor
      }),

    clearOutput: () =>
      set((state) => {
        state.outputURI = null
      }),
  }))
)
