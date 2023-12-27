import { getDataURIFromInput, setDataURIFromFile } from '@/services/imageUtilities'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { useEffect, useState } from 'react'

interface WindowSize {
  width: number | undefined
  height: number | undefined
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Convert to function expression
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      window.addEventListener('resize', handleResize)
      handleResize()

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}

function registerEventHandlers(): void {
  const setTempUri = useImageStore((state) => state.setTempURI)
  const setTempFileName = useImageStore((state) => state.setTempFileName)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)

  if (typeof window !== 'undefined') {
    window.addEventListener('paste', (e) => {
      pasteListener(e, setTempUri, setTempFileName, setInputModalOpen)
    })
    const preventDefaultListeners = ['dragenter', 'drag', 'dragover', 'dragend', 'dragstart']
    preventDefaultListeners.forEach((event) => {
      window.addEventListener(event, preventDefault)
    })
    window.addEventListener('drop', (e) => {
      dropListener(e, setTempFileName, setTempUri, setInputModalOpen)
    })
  }
}

function handleInputFile(
  items: DataTransferItemList,
  setFileName: (name: string) => void,
  setInputURI: (uri: string) => void,
): boolean {
  try {
    for (const index in items) {
      const item = items[index]
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) {
          setFileName(file.name.split('/').at(-1)!.split('.')[0])
          setDataURIFromFile(file, setInputURI)
          return true
        }
      }
    }
    return false
  } catch (e) {
    console.error(e)
    console.error('Unable to handle input image')
    return false
  }
}

const pasteListener = (
  e: ClipboardEvent,
  setInputURI: (uri: string) => void,
  setFileName: (name: string) => void,
  setInputModalOpen: (open: boolean) => void,
) => {
  if (e.clipboardData && e.clipboardData.getData('text/plain')) {
    const url = e.clipboardData.getData('text/plain')
    getDataURIFromInput(url).then((u) => {
      setInputURI(u)
    })
    setFileName(url.split('/').at(-1)!.split('.')[0])
  } else if (e.clipboardData) {
    const success = handleInputFile(e.clipboardData.items, setFileName, setInputURI)
    if (success) {
      setInputModalOpen(true)
    }
  }
}

const dropListener = (
  e: DragEvent,
  setFileName: (name: string) => void,
  setInputURI: (uri: string) => void,
  setInputModalOpen: (open: boolean) => void,
) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer) {
    const success = handleInputFile(e.dataTransfer.items, setFileName, setInputURI)
    if (success) {
      setInputModalOpen(true)
      setFileName(e.dataTransfer.files[0].name.split('/').at(-1)!.split('.')[0])
    }
  }
}

const preventDefault = (e: Event) => {
  e.preventDefault()
}

export { useWindowSize, registerEventHandlers }
