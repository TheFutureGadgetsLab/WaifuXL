import default_tags from '../services/landing_tags'
import create from 'zustand'

const useImageStore = create((set) => ({
  inputURI: './images/senjougahara.webp', // Input image URI
  outputURI: './images/senjougahara_2x.webp', // Output image URI
  tags: default_tags, // Tags returned by tagger network
  fileName: 'example', // Output file name
  extension: 'webp', // Output file extension
  upscaleFactor: 1, // Upscale factor (will be automatically log2'd)

  setInputURI: (uri) => {
    set(() => ({ inputURI: uri }))
    set(() => ({ outputURI: null }))

    if (uri.slice(0, 14) == 'data:image/gif') {
      set(() => ({ extension: 'gif' }))
    } else {
      set(() => ({ extension: 'png' }))
    }
  },
  setUpscaleFactor: (newFactor) => set(() => ({ upscaleFactor: Math.log2(newFactor) })),

  setOutputURI: (uri) => set(() => ({ outputURI: uri })),
  setTags: (newTags) => set(() => ({ tags: newTags })),
  setFileName: (newFilename) => set(() => ({ fileName: newFilename })),
}))

const useAppStateStore = create((set) => ({
  loadProg: -1, // Progress of model loading

  inputModalOpen: false, // Flag indicating if input modal is open
  showSidebar: true, // Flag indicating if sidebar is open
  mobile: false, // Are we on a mobile aspect ratio?
  errorMessage: null, // Error message to display
  running: false, // Flag indicating if we should run the model, fires a useEffect

  setInputModalOpen: (newInputModalOpen) => set(() => ({ inputModalOpen: newInputModalOpen })),
  setShowSidebar: (newShowSidebar) => set(() => ({ showSidebar: newShowSidebar })),
  setMobile: (newMobile) => set(() => ({ mobile: newMobile })),
  setErrorMessage: (newError) => set(() => ({ errorMessage: newError })),
  setRunning: (newRunning) => set(() => ({ running: newRunning })),
  setLoadProg: (newProg) => set(() => ({ loadProg: newProg })),
}))

export { useImageStore, useAppStateStore }
