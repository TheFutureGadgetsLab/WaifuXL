import { useState, useEffect } from 'react'
import { dropListener, pasteListener, preventDefault } from '../services/eventListeners'
import { useImageStore, useAppStateStore } from '../services/useState'

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

  const setInputURI = useImageStore((state) => state.setInputURI)
  const setFileName = useImageStore((state) => state.setFileName)
  const setShowSidebar = useAppStateStore((state) => state.setShowSidebar)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)

  if (typeof window !== 'undefined') {
    window.addEventListener('paste', (e) => {
      pasteListener(e, setInputURI, setFileName, setShowSidebar, setInputModalOpen)
    })
    window.addEventListener('dragenter', preventDefault)
    window.addEventListener('drag', preventDefault)
    window.addEventListener('dragover', preventDefault)
    window.addEventListener('dragend', preventDefault)
    window.addEventListener('dragstart', preventDefault)
    window.addEventListener('drop', (e) => {
      dropListener(e, setFileName, setInputURI, setShowSidebar, setInputModalOpen)
    })
  }

  return windowSize
}

export { useWindowSize }
