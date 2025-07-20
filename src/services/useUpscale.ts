import { useCallback } from 'react'
import { upscaleAndTag } from './inference'
import { useAppStateStore, useImageStore } from './useState'

export const useUpscale = () => {
  const inputURI = useImageStore((state) => state.inputURI)
  const upscaleFactor = useImageStore((state) => state.upscaleFactor)
  const setOutputURI = useImageStore((state) => state.setOutputURI)
  const setTags = useImageStore((state) => state.setTags)
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)
  const setRunning = useAppStateStore((state) => state.setRunning)

  const handleUpscale = useCallback(async () => {
    try {
      setRunning(true)
      const result = await upscaleAndTag(setTags, inputURI, upscaleFactor)
      if (result) setOutputURI(result)
    } finally {
      setRunning(false)
      setUpscaleFactor(1)
    }
  }, [inputURI, upscaleFactor, setOutputURI, setTags, setRunning, setUpscaleFactor])

  return handleUpscale
}
