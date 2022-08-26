import NavbarComponent from '../components/NavbarComponent'
import TitleComponent from '../components/TitleComponent'
import Sidebar from '../components/SidebarComponent'
import ImageDisplay from '../components/ImageDisplayComponent'
import AnnouncementComponent from '../components/Announcement'
import Error from '../components/ErrorComponent'
import ModalComponent from '../components/ModalComponent'
import { dropListener, pasteListener, preventDefault } from '../services/eventListeners'
import { useState, useEffect } from 'react'
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
  return windowSize
}

export default function Main() {
  const size = useWindowSize()

  const setInputURI = useImageStore((state) => state.setInputURI)
  const setFileName = useImageStore((state) => state.setFileName)
  const setShowSidebar = useAppStateStore((state) => state.setShowSidebar)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const inputModalOpen = useAppStateStore((state) => state.inputModalOpen)
  const setMobile = useAppStateStore((state) => state.setMobile)
  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

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
        {inputModalOpen && (
          <div className="w-80 flex flex-col fixed inset-y-0 z-20">
            <ModalComponent useImageStore={useImageStore} useAppStateStore={useAppStateStore} />
          </div>
        )}
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
