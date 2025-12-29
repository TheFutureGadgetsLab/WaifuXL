import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { upscaleAndTag } from './inference'
import { useAppStateStore, useImageStore } from './useState'

export const useUpscale = () => {
  const { inputURI, upscaleFactor, setOutputURI, setTags, setUpscaleFactor } = useImageStore(
    useShallow((state) => ({
      inputURI: state.inputURI,
      upscaleFactor: state.upscaleFactor,
      setOutputURI: state.setOutputURI,
      setTags: state.setTags,
      setUpscaleFactor: state.setUpscaleFactor,
    }))
  )

  const { setRunning, setShouldFlashSidebarButton, setShouldFlashDownloadButton } = useAppStateStore(
    useShallow((state) => ({
      setRunning: state.setRunning,
      setShouldFlashSidebarButton: state.setShouldFlashSidebarButton,
      setShouldFlashDownloadButton: state.setShouldFlashDownloadButton,
    }))
  )

  const handleUpscale = useCallback(async () => {
    try {
      setRunning(true)
      const result = await upscaleAndTag(setTags, inputURI, upscaleFactor)
      if (result) {
        setOutputURI(result)
        setShouldFlashSidebarButton(true)
        setShouldFlashDownloadButton(true)
      }
    } finally {
      setRunning(false)
      setUpscaleFactor(1)
    }
  }, [inputURI, upscaleFactor, setOutputURI, setTags, setRunning, setUpscaleFactor, setShouldFlashSidebarButton, setShouldFlashDownloadButton])

  return handleUpscale
}
