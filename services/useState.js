import default_tags from '../services/landing_tags'
import create from 'zustand'

const useImageStore = create((set) => ({
  inputURI: './images/senjougahara.webp',
  outputURI: './images/senjougahara_2x.webp',
  tags: default_tags,
  fileName: 'example',
  extension: 'png',
  upscaleFactor: 1,

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
  loading: false,
  inputModalOpen: false,
  showSidebar: true,
  userHasRun: false,
  modelLoading: false,
  mobile: false,
  errorMessage: null,
  shouldRun: false,
  modelLoadProg: 0,

  setLoading: (newLoading) => set((state) => ({ loading: newLoading })),
  setInputModalOpen: (newInputModalOpen) => set((state) => ({ inputModalOpen: newInputModalOpen })),
  setShowSidebar: (newShowSidebar) => set((state) => ({ showSidebar: newShowSidebar })),
  setUserHasRun: (newUserHasRun) => set((state) => ({ userHasRun: newUserHasRun })),
  setModelLoading: () => set((state) => ({ modelLoading: !state.modelLoading })),
  setMobile: (newMobile) => set((state) => ({ mobile: newMobile })),
  setErrorMessage: (newError) => set((state) => ({ errorMessage: newError })),
  setShouldRun: (newShouldRun) => set((state) => ({ shouldRun: newShouldRun })),
  setModelLoadProg: (newProg) => set((state) => ({ modelLoadProg: newProg })),
}))

export { useImageStore, useAppStateStore }
