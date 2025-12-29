import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
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
  inputURI: './images/senjougahara.webp',
  outputURI: './images/senjougahara_2x.webp',
  tags: default_tags,
  upscaleFactor: 1,
}

const emptyTags: ModelTags = {
  topDesc: [],
  topChars: [],
  rating: [],
}

export const useImageStore = create(
  immer<ImageStoreState & ImageStoreActions>((set) => ({
    ...initialState,

    setInputURI: (uri) =>
      set((state) => {
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

    reset: () => set(() => initialState),

    clearOutput: () =>
      set((state) => {
        state.outputURI = null
      }),
  }))
)
