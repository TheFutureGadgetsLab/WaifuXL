import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { useImageStore, useAppStateStore } from '../services/useState'

const ImageDisplay = () => {
  const mobile = useAppStateStore((state) => state.mobile)
  const outputURI = useImageStore((state) => state.outputURI)
  const inputURI = useImageStore((state) => state.inputURI)

  return (
    <div className={'items-center flex justify-center w-full drop-shadow-md overflow-hidden'}>
      {outputURI == null ? (
        <img
          src={inputURI}
          style={{
            width: mobile ? '70vh' : 'auto',
            height: mobile ? 'auto' : '70vh',
          }}
        />
      ) : (
        <ReactCompareSlider
          position={50}
          itemOne={<ReactCompareSliderImage src={inputURI} alt="Image one" />}
          itemTwo={<ReactCompareSliderImage src={outputURI} alt="Image two" />}
          style={{
            width: mobile ? 'auto' : 'auto',
            height: mobile ? 'auto' : '70vh',
          }}
        />
      )}
    </div>
  )
}

export default ImageDisplay
