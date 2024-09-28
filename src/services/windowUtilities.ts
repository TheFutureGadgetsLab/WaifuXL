import { useCallback, useEffect, useState } from 'react'
import { useAppStateStore, useImageStore } from './useState'

interface WindowSize {
  width: number
  height: number
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export const registerEventHandlers = (): void => {
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text/plain')
      if (text) {
        setInputURI(text)
      } else if (handleInputFile(e.clipboardData?.items)) {
        setInputModalOpen(true)
      }
    },
    [setInputURI, setInputModalOpen],
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      if (handleInputFile(e.dataTransfer?.items)) {
        setInputModalOpen(true)
      }
    },
    [setInputModalOpen],
  )

  const handleInputFile = useCallback(
    (items?: DataTransferItemList): boolean => {
      if (!items) return false
      const file = Array.from(items)
        .find((item) => item.kind === 'file')
        ?.getAsFile()
      if (file) {
        setInputURI(file)
        return true
      }
      return false
    },
    [setInputURI],
  )

  useEffect(() => {
    window.addEventListener('paste', handlePaste)
    window.addEventListener('drop', handleDrop)
    const preventDefault = (e: Event) => e.preventDefault()

    const events = ['dragenter', 'dragover', 'dragstart', 'dragend']
    events.forEach((event) => window.addEventListener(event, preventDefault))

    return () => {
      window.removeEventListener('paste', handlePaste)
      window.removeEventListener('drop', handleDrop)
      events.forEach((event) => window.removeEventListener(event, preventDefault))
    }
  }, [handlePaste, handleDrop])
}
