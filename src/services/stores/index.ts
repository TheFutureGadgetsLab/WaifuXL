// Re-export all stores
export { useImageStore, type UpscaleFactor, type ImageStoreState, type ImageStoreActions } from './imageStore'
export {
  useProcessingStore,
  getProgressText,
  type ProcessingStage,
  type ProcessingStatus,
  type ProgressInfo,
  type ProcessingStoreState,
  type ProcessingStoreActions,
} from './processingStore'
