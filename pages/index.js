import NavbarComponent from '../components/NavbarComponent'
import TitleComponent from '../components/TitleComponent'
import { Sidebar, UpscaleContainer, CopyComponent } from '../components/SidebarComponent'
import ImageDisplay from '../components/ImageDisplayComponent'
import AnnouncementComponent from '../components/Announcement'
import Error from '../components/ErrorComponent'
import { ModalComponent, PresetMenuComponent } from '../components/ModalComponent'
import ScreenIcons from '../components/ScreenIconsComponent'
import { useAppStateStore, useImageStore } from '../services/useState'
import { useWindowSize } from '../services/windowUtilities'
import { useEffect } from 'react'
import { KizunaBG, MobileBG } from '../components/SVGComponents'
import DownloadComponent from '../components/DownloadComponent'
export default function Main() {
  const size = useWindowSize()
  const setMobile = useAppStateStore((state) => state.setMobile)
  const mobile = useAppStateStore((state) => state.mobile)
  const [outputURI, extension, tags] = useImageStore((state) => [state.outputURI, state.extension, state.tags])

  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

  return mobile ? (
    <>
      <NavbarComponent currentPage="index" />
      <PresetMenuComponent />
      <div className="h-3/4 grow w-full">
        <ImageDisplay />
      </div>
      <br />
      {outputURI != null ? (
        <>
          <DownloadComponent />
          <CopyComponent />
        </>
      ) : (
        <UpscaleContainer />
      )}
      <br />
      <MobileBG />
      <br />
      <TitleComponent />
    </>
  ) : (
    <div className="overflow-hidden">
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
  )
}
