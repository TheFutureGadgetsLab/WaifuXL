import NavbarComponent from '../components/NavbarComponent'
import TitleComponent from '../components/TitleComponent'
import Sidebar from '../components/SidebarComponent'
import ImageDisplay from '../components/ImageDisplayComponent'
import AnnouncementComponent from '../components/Announcement'
import Error from '../components/ErrorComponent'
import ModalComponent from '../components/ModalComponent'
import { useAppStateStore } from '../services/useState'
import { useWindowSize } from '../services/windowUtilities'
import { useEffect } from 'react'
import { KizunaBG } from '../components/SVGComponents'
import ScreenIcons from '../components/ScreenIconsComponent'

export default function Main() {
  const size = useWindowSize()
  const setMobile = useAppStateStore((state) => state.setMobile)

  useEffect(() => {
    setMobile(size.width / size.height < 1.0)
  }, [size])

  return (
    <div className="overflow-hidden">
      <ScreenIcons />
      <KizunaBG />
      <Error />
      <Sidebar />
      <ModalComponent />
      <main className="flex-1">
        <AnnouncementComponent announcement="Safari performance will be worse than other browsers. If possible use a non-webkit based browser." />
        <div className="flex flex-col items-center h-full w-screen relative">
          <NavbarComponent currentPage="index" />
        </div>
        <div className="h-3/4 grow w-full">
            <ImageDisplay />
            <TitleComponent />
        </div>
      </main>
    </div>
  )
}
