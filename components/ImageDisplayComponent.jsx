import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

const ImageDisplay = ({ useImageStore, useAppStateStore }) => {
  const mobile = useAppStateStore((state) => state.mobile)
  const outputURI = useImageStore((state) => state.outputURI)
  const inputURI = useImageStore((state) => state.inputURI)

  return (
    <div
      className={`${mobile ? 'h-2/3' : 'h-5/6'} items-center flex justify-center w-full drop-shadow-md overflow-hidden`}
    >
      {outputURI == null ? (
        <img
          src={inputURI}
          className="h-5/6"
          style={{
            width: mobile ? '70vw' : 'auto',
            height: mobile ? 'auto' : '70vh',
          }}
        />
      ) : (
        <ReactCompareSlider
          className="h-5/6"
          position={50}
          itemOne={<ReactCompareSliderImage src={inputURI} alt="Image one" />}
          itemTwo={<ReactCompareSliderImage src={outputURI} alt="Image two" />}
          style={{
            width: mobile ? '70vw' : 'auto',
            height: mobile ? 'auto' : '70vh',
          }}
        />
      )}
    </div>
  )
}

export default ImageDisplay
