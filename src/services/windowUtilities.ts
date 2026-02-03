import { useCallback, useEffect, useRef } from 'react'
import { useImageStore, useProcessingStore } from './stores'
import { getImageURI } from './utils'
import { parseError } from './errors'

export function useEventHandlers(): void {
  const isRegistered = useRef(false)
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setError = useProcessingStore((state) => state.setError)

  const preventDefault = useCallback((e: Event) => e.preventDefault(), [])

  const handleInputFile = useCallback(
    async (items?: DataTransferItemList): Promise<boolean> => {
      if (!items) return false
      const file = Array.from(items)
        .find((item) => item.kind === 'file')
        ?.getAsFile()
      if (file) {
        try {
          const uri = await getImageURI(file)
          setInputURI(uri)
          return true
        } catch (error) {
          setError(parseError(error))
        }
      }
      return false
    },
    [setInputURI, setError]
  )

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const handledFile = await handleInputFile(e.clipboardData?.items)
      if (handledFile) return

      const text = e.clipboardData?.getData('text/plain')
      if (!text) return

      try {
        const uri = await getImageURI(text)
        setInputURI(uri)
      } catch (error) {
        setError(parseError(error))
      }
    },
    [setInputURI, handleInputFile, setError]
  )

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault()
      await handleInputFile(e.dataTransfer?.items)
    },
    [handleInputFile]
  )

  useEffect(() => {
    if (isRegistered.current) return
    isRegistered.current = true

    window.addEventListener('paste', handlePaste)
    window.addEventListener('drop', handleDrop)

    const dragEvents = ['dragenter', 'dragover', 'dragstart', 'dragend'] as const
    dragEvents.forEach((event) => window.addEventListener(event, preventDefault))

    return () => {
      isRegistered.current = false
      window.removeEventListener('paste', handlePaste)
      window.removeEventListener('drop', handleDrop)
      dragEvents.forEach((event) => window.removeEventListener(event, preventDefault))
    }
  }, [handlePaste, handleDrop, preventDefault])
}
