import { GitHubSVG, HamSVG } from './SVGComponents'
import { useAppStateStore } from '../services/useState'

const ScreenIcons = () => {
  const setShowSidebar = useAppStateStore((state) => state.setShowSidebar)
  const showSidebar = useAppStateStore((state) => state.showSidebar)
  return (
    <>
      <HamSVG onClick={() => setShowSidebar(!showSidebar)} className="fixed left-5 top-4 cursor-pointer" />
      <GitHubSVG className="fixed right-5 top-4" />
    </>
  )
}

export default ScreenIcons
