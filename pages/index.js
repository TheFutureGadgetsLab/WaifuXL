import NavbarComponent from '@/components/NavbarComponent'
import TitleComponent from '@/components/TitleComponent'
import { Sidebar, UpscaleFactorComponent } from '@/components/SidebarComponent'
import ImageDisplay from '@/components/ImageDisplayComponent'
import Error from '@/components/ErrorComponent'
import Feedback from '@/components/FeedbackModal'
import { ModalComponent, UploadButtonComponent } from '@/components/ModalComponent'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { useWindowSize } from '@/services/windowUtilities'
import { useEffect } from 'react'
import { BackgroundImage } from '@/components/SVGComponents'
import { DownloadComponent, CopyComponent } from '@/components/ButtonComponents'
import RunComponent from '@/components/RunComponent'
import { Fireworks } from 'fireworks/lib/react'

export default function Main() {
  const size = useWindowSize()
  const setMobile = useAppStateStore((state) => state.setMobile)

  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

  return (
    <>
      <MobileLayout />
      <DesktopLayout />
      <BackgroundImage />
    </>
  )
}

function MobileLayout() {
  const size = useWindowSize()
  const setMobile = useAppStateStore((state) => state.setMobile)
  const outputURI = useImageStore((state) => state.outputURI)

  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

  return (
    <div className="h-fit md:hidden">
      <NavbarComponent currentPage="index" />
      <div className="grid grid-flow-col gap-1 ml-1 mr-1 justify-center mb-2"></div>
      <TitleComponent />
      <div className="mb-2">
        <ImageDisplay />
      </div>
      {outputURI != null ? (
        <div className="grid grid-flow-col gap-1 ml-1 mr-1 justify-center">
          <UploadButtonComponent />
          <DownloadComponent />
          <CopyComponent />
        </div>
      ) : (
        <div className="grid grid-flow-col gap-1 ml-1 mr-1 justify-center">
          <RunComponent />
          <UpscaleFactorComponent />
        </div>
      )}
    </div>
  )
}

function DesktopLayout() {
  const size = useWindowSize()
  const setMobile = useAppStateStore((state) => state.setMobile)

  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

  return (
    <div className="overflow-hidden hidden md:block min-h-screen">
      <Fireworks
        count={5}
        canvasWidth={size.width}
        canvasHeight={size.height}
        bubbleSizeMaximum={5}
        calc={(props, i) => ({
          ...props,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        })}
      />
      <Error />
      <Feedback />
      <Sidebar />
      <ModalComponent />
      <main className="flex-1">
        {/* <AnnouncementComponent announcement="Safari performance will be worse than other browsers. If possible use a non-webkit based browser." /> */}
        <NavbarComponent currentPage="index" />
        <div className="h-3/4 grow w-full">
          <ImageDisplay />
          <TitleComponent />
        </div>
      </main>
    </div>
  )
}
