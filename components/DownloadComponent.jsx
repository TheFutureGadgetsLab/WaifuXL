import { downloadImage } from '../services/imageUtilities'
import { DownloadSVG } from './SVGComponents'
import { useImageStore } from '../services/useState'

const DownloadComponent = () => {
  const [fileName, extension, outputURI] = useImageStore((state) => [state.fileName, state.extension, state.outputURI])

  return (
    <button
      className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center"
      onClick={() => downloadImage(fileName, extension, outputURI)}
    >
      <DownloadSVG /> <span>Download Upscaled</span>
    </button>
  )
}

export default DownloadComponent
