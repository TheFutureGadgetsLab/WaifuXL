import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { useImageStore, useAppStateStore } from '@/services/useState'
import Image from 'next/image'

const ImageDisplay = () => {
  const mobile = useAppStateStore((state) => state.mobile)
  const outputURI = useImageStore((state) => state.outputURI)
  const inputURI = useImageStore((state) => state.inputURI)

  const styling = {
    maxHeight: mobile ? '100vw' : '',
    maxWidth: mobile ? '100vw' : '',
    minHeight: mobile ? '100vw' : '',
    minWidth: mobile ? '100vw' : '',
    width: mobile ? 'auto' : 'auto',
    height: mobile ? 'auto' : '70vh',
    objectFit: mobile ? 'cover' : '',
  }
  return (
    <div
      className={`items-center flex justify-center drop-shadow-md overflow-hidden ml-5 mr-5 ${!mobile ? 'w-full' : ''}`}
    >
      {outputURI == null ? (
        <Image src={inputURI} width="1" height="1" style={styling} />
      ) : (
        <ReactCompareSlider
          position={50}
          itemOne={<ReactCompareSliderImage src={inputURI} style={styling} alt="Before image" />}
          itemTwo={<ReactCompareSliderImage src={outputURI} style={styling} alt="After image" />}
        />
      )}
    </div>
  )
}

export default ImageDisplay
