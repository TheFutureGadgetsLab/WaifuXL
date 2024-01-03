import { useAppStateStore, useImageStore } from '@/services/useState'
import { useEffect, useState } from 'react'

interface WindowSize {
  width: number | undefined
  height: number | undefined
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: undefined, height: undefined })

  if (typeof window === 'undefined') {
    return windowSize
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

function registerEventHandlers(): void {
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)

  window.addEventListener('paste', (e) => pasteListener(e, setInputURI, setInputModalOpen))
  const preventDefaultListeners = ['dragenter', 'dragover', 'dragstart', 'dragend']
  preventDefaultListeners.forEach((event) => window.addEventListener(event, preventDefault))
  window.addEventListener('drop', (e) => dropListener(e, setInputURI, setInputModalOpen))
}

function handleInputFile(items: DataTransferItemList, setInputURI: (uri: string | File) => void): boolean {
  let success = false
  Array.from(items).forEach((item) => {
    if (item.kind === 'file') {
      const file = item.getAsFile()
      if (file) {
        setInputURI(file)
        success = true
      }
    }
  })
  return success
}

const pasteListener = (
  e: ClipboardEvent,
  setInputURI: (uri: string | File) => void,
  setInputModalOpen: (open: boolean) => void,
) => {
  if (e.clipboardData && e.clipboardData.getData('text/plain')) {
    setInputURI(e.clipboardData.getData('text/plain'))
  } else if (e.clipboardData) {
    if (handleInputFile(e.clipboardData.items, setInputURI)) {
      setInputModalOpen(true)
    }
  }
}

const dropListener = (
  e: DragEvent,
  setInputURI: (uri: string | File) => void,
  setInputModalOpen: (open: boolean) => void,
) => {
  e.preventDefault()
  if (e.dataTransfer && handleInputFile(e.dataTransfer.items, setInputURI)) {
    setInputModalOpen(true)
  }
}

const preventDefault = (e: Event) => e.preventDefault()

export { useWindowSize, registerEventHandlers }
