import { getDataURIFromInput, setDataURIFromFile } from '@/services/imageUtilities'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { useEffect, useState } from 'react'

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      // Add event listener
      window.addEventListener('resize', handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount

  return windowSize
}

function registerEventHandlers() {
  const setTempUri = useImageStore((state) => state.setTempURI)
  const setTempFileName = useImageStore((state) => state.setTempFileName)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)

  if (typeof window !== 'undefined') {
    window.addEventListener('paste', (e) => {
      pasteListener(e, setTempUri, setTempFileName, setInputModalOpen)
    })
    window.addEventListener('dragenter', preventDefault)
    window.addEventListener('drag', preventDefault)
    window.addEventListener('dragover', preventDefault)
    window.addEventListener('dragend', preventDefault)
    window.addEventListener('dragstart', preventDefault)
    window.addEventListener('drop', (e) => {
      dropListener(e, setTempFileName, setTempUri, setInputModalOpen)
    })
  }
}

function handleInputFile(items, setFileName, setInputURI) {
  try {
    for (const index in items) {
      const item = items[index]
      if (item.kind === 'file') {
        const file = item.getAsFile()
        setFileName(file.name.split('/').at(-1).split('.')[0])
        setDataURIFromFile(file, setInputURI)
        return true
      }
    }
  } catch (e) {
    console.error(e)
    console.error('Unable to handle input image')
    return false
  }
}

const pasteListener = (e, setInputURI, setFileName, setInputModalOpen) => {
  if (e.clipboardData.getData('text/plain')) {
    const url = e.clipboardData.getData('text/plain')
    getDataURIFromInput(url).then((u) => {
      setInputURI(u)
    })
    setFileName(url.split('/').at(-1).split('.')[0])
  } else {
    const success = handleInputFile((e.clipboardData || e.originalEvent.clipboardData).items, setFileName, setInputURI)
    if (success) {
      setInputModalOpen(true)
    }
  }
}

const dropListener = (e, setFileName, setInputURI, setInputModalOpen) => {
  e.preventDefault()
  e.stopPropagation()
  const success = handleInputFile(e.dataTransfer.items, setFileName, setInputURI)
  if (success) {
    setInputModalOpen(true)
    setFileName(e.dataTransfer.files[0].name.split('/').at(-1).split('.')[0])
  }
}

const preventDefault = (e) => {
  e.preventDefault()
}

export { useWindowSize, registerEventHandlers }
