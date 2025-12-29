'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useImageStore, useProcessingStore } from '@/services/stores'
import { upscaleImage } from '@/services/inference'
import { parseError, isAbortError } from '@/services/errors'

export function useUpscale() {
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup on unmount - abort any in-progress operation
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // State values - trigger re-render when changed
  const inputURI = useImageStore((state) => state.inputURI)
  const upscaleFactor = useImageStore((state) => state.upscaleFactor)

  // Actions - stable references, accessed directly
  const setOutputURI = useImageStore((state) => state.setOutputURI)
  const setTags = useImageStore((state) => state.setTags)
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)
  const startProcessing = useProcessingStore((state) => state.startProcessing)
  const setProgress = useProcessingStore((state) => state.setProgress)
  const setComplete = useProcessingStore((state) => state.setComplete)
  const setError = useProcessingStore((state) => state.setError)
  const resetProcessing = useProcessingStore((state) => state.reset)

  const execute = useCallback(async () => {
    if (!inputURI) return

    // Abort any previous operation
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    startProcessing()

    try {
      const result = await upscaleImage(inputURI, upscaleFactor, {
        onProgress: setProgress,
        onTags: setTags, // Set tags immediately when ready (before upscaling completes)
        signal: abortControllerRef.current.signal,
      })

      // Update stores with results
      setOutputURI(result.outputURI)
      setComplete()
      setUpscaleFactor(1) // Reset factor after successful upscale
    } catch (error) {
      if (!isAbortError(error)) {
        setError(parseError(error))
      } else {
        // On abort, just reset to idle
        resetProcessing()
      }
    }
  }, [inputURI, upscaleFactor, startProcessing, setProgress, setComplete, setError, resetProcessing, setOutputURI, setTags, setUpscaleFactor])

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
    resetProcessing()
  }, [resetProcessing])

  return { execute, cancel }
}
