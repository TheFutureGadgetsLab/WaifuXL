import NavbarComponent from '../components/NavbarComponent'
import TitleComponent from '../components/TitleComponent'
import { useState, useEffect } from 'react'
import Sidebar from '../components/SidebarComponent'
import ImageDisplay from '../components/ImageDisplayComponent'
import { setEventListeners } from '../services/setEventListeners'
import AnnouncementComponent from '../components/Announcement'
import Error from '../components/ErrorComponent'
import default_tags from '../services/landing_tags'
import create from 'zustand'

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
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

export default function Main() {
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
    },
    setUpscaleFactor: (newFactor) => set(() => ({ upscaleFactor: Math.log2(newFactor) })),

    setOutputURI: (uri) => set(() => ({ outputURI: uri })),
    setTags: (newTags) => set(() => ({ tags: newTags })),
    setFileName: (newFilename) => set(() => ({ fileName: newFilename })),
    setExtension: (newExt) => set(() => ({ extension: newExt })),
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
    setShowSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
    setUserHasRun: (newUserHasRun) => set((state) => ({ userHasRun: newUserHasRun })),
    setModelLoading: () => set((state) => ({ modelLoading: !state.modelLoading })),
    setMobile: () => set((state) => ({ mobile: !state.mobile })),
    setErrorMessage: (newError) => set((state) => ({ errorMessage: newError })),
    setShouldRun: (newShouldRun) => set((state) => ({ shouldRun: newShouldRun })),
    setModelLoadProg: (newProg) => set((state) => ({ modelLoadProg: newProg })),
  }))

  const size = useWindowSize()

  const setInputURI = useImageStore((state) => state.setInputURI)
  const setFileName = useImageStore((state) => state.setFileName)
  const setShowSidebar = useAppStateStore((state) => state.setShowSidebar)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)

  const setMobile = useAppStateStore((state) => state.setMobile)
  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

  useEffect(() => {
    setEventListeners(setInputURI, setFileName, setShowSidebar, setInputModalOpen)
  }, [])

  return (
    <>
      {useAppStateStore((state) => state.errorMessage) ? (
        <Error errorMessage={useAppStateStore((state) => state.errorMessage)} />
      ) : (
        <></>
      )}
      <div
        style={{
          backgroundImage: `url("images/bg.svg")`,
          backgroundSize: 'cover',
          backgroundPositionX: 'right',
        }}
      >
        <Sidebar useAppStateStore={useAppStateStore} useImageStore={useImageStore} />
        {/* Image display, title, navbar */}
        <main className="flex-1">
          <AnnouncementComponent
            announcement={
              'Safari performance will be worse than other browsers. If possible use a non-webkit based browser.'
            }
            mobile={useAppStateStore((state) => state.mobile)}
          />

          <div className="flex flex-col items-center h-screen w-screen relative">
            <NavbarComponent currentPage="index" />

            <div className={`h-3/4 grow w-full`}>
              <ImageDisplay useImageStore={useImageStore} useAppStateStore={useAppStateStore} />
              <TitleComponent useAppStateStore={useAppStateStore} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
