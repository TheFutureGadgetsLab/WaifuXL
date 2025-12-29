// Error types for the application

export type ErrorType =
  | 'image-load'
  | 'model-load'
  | 'inference'
  | 'network'
  | 'cors'
  | 'clipboard'
  | 'abort'
  | 'unknown'

export interface AppError {
  type: ErrorType
  message: string
  userMessage: string
  retryable: boolean
  originalError?: unknown
}

// Helper for case-insensitive CORS detection across browsers
function isCorsError(message: string): boolean {
  const msg = message.toLowerCase()
  return msg.includes('cors') || msg.includes('cross-origin') || msg.includes('blocked by cors')
}

// Error factory functions
export function createImageLoadError(originalError?: unknown): AppError {
  const isCors = originalError instanceof Error && isCorsError(originalError.message)

  if (isCors) {
    return {
      type: 'cors',
      message: 'CORS error loading image',
      userMessage: 'Cannot load this image due to cross-origin restrictions. Try downloading and uploading it instead.',
      retryable: false,
      originalError,
    }
  }

  return {
    type: 'image-load',
    message: 'Failed to load image',
    userMessage: 'Failed to load the image. Please check the URL or try a different image.',
    retryable: true,
    originalError,
  }
}

export function createModelLoadError(originalError?: unknown): AppError {
  return {
    type: 'model-load',
    message: 'Failed to load ONNX models',
    userMessage: 'Failed to load the AI models. Please refresh the page and try again.',
    retryable: true,
    originalError,
  }
}

export function createInferenceError(stage: string, originalError?: unknown): AppError {
  return {
    type: 'inference',
    message: `Inference failed during ${stage}`,
    userMessage: `Processing failed during ${stage}. Please try again with a different image or smaller size.`,
    retryable: true,
    originalError,
  }
}

export function createNetworkError(originalError?: unknown): AppError {
  return {
    type: 'network',
    message: 'Network request failed',
    userMessage: 'Network error. Please check your connection and try again.',
    retryable: true,
    originalError,
  }
}

export function createAbortError(): AppError {
  return {
    type: 'abort',
    message: 'Operation was cancelled',
    userMessage: 'Operation cancelled.',
    retryable: false,
  }
}

// Parse unknown errors into AppError
export function parseError(error: unknown): AppError {
  if (error instanceof Error) {
    // Check for abort
    if (error.name === 'AbortError') {
      return createAbortError()
    }

    // Check for network errors
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return createNetworkError(error)
    }

    // Check for CORS
    if (isCorsError(error.message)) {
      return createImageLoadError(error)
    }

    // Check for image loading - use specific patterns to avoid false positives
    if (/load.*image|image.*load|decode.*image|image.*failed/i.test(error.message)) {
      return createImageLoadError(error)
    }
  }

  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : 'Unknown error',
    userMessage: 'An unexpected error occurred. Please try again.',
    retryable: true,
    originalError: error,
  }
}

// Type guard for checking if an error is an abort
export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof Error && error.name === 'AbortError') ||
    (typeof error === 'object' && error !== null && 'type' in error && (error as AppError).type === 'abort')
  )
}
