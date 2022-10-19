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
            maxHeight: mobile ? '100vw' : '',
            maxWidth: mobile ? '100vh' : '',
            minHeight: mobile ? '100vw' : '',
            width: mobile ? 'auto' : 'auto',
            height: mobile ? 'auto' : '70vh',
            objectFit: mobile ? 'cover' : '',
          }}
        />
      ) : (
        <ReactCompareSlider
          position={50}
          itemOne={
            <ReactCompareSliderImage
              src={inputURI}
              style={{
                maxHeight: mobile ? '100vw' : '',
                maxWidth: mobile ? '100vh' : '',
                minHeight: mobile ? '100vw' : '',
                width: mobile ? 'auto' : 'auto',
                height: mobile ? 'auto' : '70vh',
                objectFit: mobile ? 'cover' : '',
              }}
              alt="Image one"
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={outputURI}
              style={{
                maxHeight: mobile ? '100vw' : '',
                maxWidth: mobile ? '100vh' : '',
                minHeight: mobile ? '100vw' : '',
                width: mobile ? 'auto' : 'auto',
                height: mobile ? 'auto' : '70vh',
                objectFit: mobile ? 'cover' : '',
              }}
              alt="Image two"
            />
          }
        />
      )}
    </div>
  )
}

export default ImageDisplay
