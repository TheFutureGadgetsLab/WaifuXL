import { CopyComponent, DownloadComponent } from '@/components/ButtonComponents'
import { ModalComponent, UploadButtonComponent } from '@/components/ModalComponent'
import { Sidebar, UpscaleFactorComponent } from '@/components/SidebarComponent'
import { useAppStateStore, useImageStore } from '@/services/useState'

import { BackgroundImage } from '@/components/SVGComponents'
import Error from '@/components/ErrorComponent'
import Feedback from '@/components/FeedbackModal'
import ImageDisplay from '@/components/ImageDisplayComponent'
import NavbarComponent from '@/components/NavbarComponent'
import RunComponent from '@/components/RunComponent'
import TitleComponent from '@/components/TitleComponent'
import { useEffect } from 'react'
import { useWindowSize } from '@/services/windowUtilities'

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
  const outputURI = useImageStore((state) => state.outputURI)

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
  return (
    <div className="overflow-hidden hidden md:block min-h-screen">
      <Error />
      <Feedback />
      <Sidebar />
      <ModalComponent />
      <main className="flex-1">
        <NavbarComponent currentPage="index" />
        <div className="h-3/4 grow w-full">
          <ImageDisplay />
          <TitleComponent />
        </div>
      </main>
    </div>
  )
}
