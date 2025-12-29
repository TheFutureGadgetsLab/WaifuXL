import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AppError } from '../errors'

// Processing stages
export type ProcessingStage = 'loading-models' | 'loading-image' | 'tagging' | 'upscaling'

// Processing status
export type ProcessingStatus = 'idle' | 'processing' | 'complete' | 'error'

// Progress info for detailed tracking
export interface ProgressInfo {
  stage: ProcessingStage
  progress: number // 0-100
  currentChunk?: number
  totalChunks?: number
  currentIteration?: number
  totalIterations?: number
}

export interface ProcessingStoreState {
  status: ProcessingStatus
  progress: ProgressInfo | null
  error: AppError | null
}

export interface ProcessingStoreActions {
  startProcessing: () => void
  setProgress: (info: ProgressInfo) => void
  setComplete: () => void
  setError: (error: AppError) => void
  clearError: () => void
  reset: () => void
}

const initialState: ProcessingStoreState = {
  status: 'idle',
  progress: null,
  error: null,
}

export const useProcessingStore = create(
  immer<ProcessingStoreState & ProcessingStoreActions>((set) => ({
    ...initialState,

    startProcessing: () =>
      set((state) => {
        state.status = 'processing'
        state.progress = { stage: 'loading-models', progress: 0 }
        state.error = null
      }),

    setProgress: (info) =>
      set((state) => {
        state.progress = info
      }),

    setComplete: () =>
      set((state) => {
        state.status = 'complete'
        state.progress = null
      }),

    setError: (error) =>
      set((state) => {
        state.status = 'error'
        state.error = error
        state.progress = null
      }),

    clearError: () =>
      set((state) => {
        state.error = null
        if (state.status === 'error') {
          state.status = 'idle'
        }
      }),

    reset: () => set(() => initialState),
  }))
)

// Selector for formatted progress text
export function getProgressText(progress: ProgressInfo | null): string {
  if (!progress) return ''

  const { stage, currentChunk, totalChunks, currentIteration, totalIterations } = progress

  switch (stage) {
    case 'loading-models':
      return 'Loading AI models...'
    case 'loading-image':
      return 'Loading image...'
    case 'tagging':
      return 'Analyzing image...'
    case 'upscaling':
      if (currentChunk !== undefined && totalChunks !== undefined) {
        const iterText =
          totalIterations !== undefined && totalIterations > 1
            ? ` (Pass ${currentIteration ?? 1}/${totalIterations})`
            : ''
        return `Upscaling: ${currentChunk}/${totalChunks} chunks${iterText}`
      }
      return 'Upscaling...'
    default:
      return 'Processing...'
  }
}
