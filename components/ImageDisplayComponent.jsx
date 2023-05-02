import Image from 'next/image'
import { ReactCompareSlider } from 'react-compare-slider'
import { useImageStore } from '@/services/useState'

const ImageDisplay = () => {
  const { inputURI, outputURI } = useImageStore()

  return (
    <div
      id="image-display-container"
      className={`items-center flex justify-center drop-shadow-md overflow-hidden ml-5 mr-5 w-auto md:w-full`}
    >
      {outputURI == null ? (
        <Image src={inputURI} width="1" height="1" id="stock-image" className="z-0" priority={true} alt="Before image" />
      ) : (
        <ReactCompareSlider
          position={50}
          itemOne={
            <Image width="500" height="500" src={inputURI} id="before-image" className="z-0" priority={true} alt="Before image" />
          }
          itemTwo={
            <Image width="500" height="500" src={outputURI} id="after-image" className="z-0" priority={true} alt="After image" />
          }
        />
      )}
    </div>
  )
}

export default ImageDisplay
