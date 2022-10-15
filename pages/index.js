import NavbarComponent from '../components/NavbarComponent'
import TitleComponent from '../components/TitleComponent'
import { Sidebar, UpscaleFactorComponent } from '../components/SidebarComponent'
import ImageDisplay from '../components/ImageDisplayComponent'
import AnnouncementComponent from '../components/Announcement'
import Error from '../components/ErrorComponent'
import { ModalComponent, PresetSelectorComponent, UploadButtonComponent } from '../components/ModalComponent'
import ScreenIcons from '../components/ScreenIconsComponent'
import { useAppStateStore, useImageStore } from '../services/useState'
import { useWindowSize } from '../services/windowUtilities'
import { useEffect } from 'react'
import { KizunaBG, MobileBG } from '../components/SVGComponents'
import { DownloadComponent, CopyComponent } from '../components/ButtonComponents'
import RunComponent from '../components/RunComponent'

export default function Main() {
  const size = useWindowSize()
  const setMobile = useAppStateStore((state) => state.setMobile)
  const mobile = useAppStateStore((state) => state.mobile)
  const [outputURI, extension, tags] = useImageStore((state) => [state.outputURI, state.extension, state.tags])

  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

  return (
    <>
      <div className="h-fit md:hidden">
        <NavbarComponent currentPage="index" />
        <div className="grid grid-flow-col gap-1 ml-1 mr-1 justify-center mb-2">
          <PresetSelectorComponent />
          <UploadButtonComponent />
        </div>
        <div className="mb-2">
          <ImageDisplay />
        </div>
        {outputURI != null ? (
          <div className="grid grid-flow-col gap-1 ml-1 mr-1 justify-center">
            <DownloadComponent />
            <CopyComponent />
          </div>
        ) : (
          <div className="grid grid-flow-col gap-1 ml-1 mr-1 justify-center">
            <RunComponent />
            <UpscaleFactorComponent />
          </div>
        )}
        <br />
        <MobileBG />
        <br />
        <TitleComponent />
      </div>
      <div className="overflow-hidden hidden md:block">
        <ScreenIcons />
        <KizunaBG />
        <Error />
        <Sidebar />
        <ModalComponent />
        <main className="flex-1">
          <AnnouncementComponent announcement="Safari performance will be worse than other browsers. If possible use a non-webkit based browser." />
          <NavbarComponent currentPage="index" />
          <div className="h-3/4 grow w-full">
            <ImageDisplay />
            <TitleComponent />
          </div>
        </main>
      </div>
    </>
  )
}
