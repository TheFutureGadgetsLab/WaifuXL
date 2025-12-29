import { useCallback, useEffect, useRef } from 'react'
import { useAppStateStore, useImageStore } from './useState'

// Module-level flag to prevent duplicate listener registration across multiple hook instances
let listenersRegistered = false

export const useEventHandlers = (): void => {
  const isRegistered = useRef(false)
  const setInputURI = useImageStore((state) => state.setInputURI)
  const resetOutput = useImageStore((state) => state.resetOutput)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)

  const handleInputFile = useCallback(
    (items?: DataTransferItemList): boolean => {
      if (!items) return false
      const file = Array.from(items)
        .find((item) => item.kind === 'file')
        ?.getAsFile()
      if (file) {
        setInputURI(file)
        resetOutput()
        return true
      }
      return false
    },
    [setInputURI, resetOutput]
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text/plain')
      if (text) {
        setInputURI(text)
        resetOutput()
      } else if (handleInputFile(e.clipboardData?.items)) {
        setInputModalOpen(true)
      }
    },
    [setInputURI, setInputModalOpen, resetOutput, handleInputFile]
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      if (handleInputFile(e.dataTransfer?.items)) {
        setInputModalOpen(true)
      }
    },
    [setInputModalOpen, handleInputFile]
  )

  useEffect(() => {
    // Guard against duplicate registration
    if (listenersRegistered || isRegistered.current) return
    listenersRegistered = true
    isRegistered.current = true

    window.addEventListener('paste', handlePaste)
    window.addEventListener('drop', handleDrop)
    const preventDefault = (e: Event) => e.preventDefault()

    const dragEvents = ['dragenter', 'dragover', 'dragstart', 'dragend'] as const
    dragEvents.forEach((event) => window.addEventListener(event, preventDefault))

    return () => {
      listenersRegistered = false
      isRegistered.current = false
      window.removeEventListener('paste', handlePaste)
      window.removeEventListener('drop', handleDrop)
      dragEvents.forEach((event) => window.removeEventListener(event, preventDefault))
    }
  }, [handlePaste, handleDrop])
}
