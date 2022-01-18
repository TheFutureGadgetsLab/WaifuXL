import {
    ReactCompareSlider,
    ReactCompareSliderImage,
  } from "react-compare-slider";
  
const ImageDisplay = ({ outputURI, inputURI }) => {
  return (
      <div className="h-5/6 flex items-center justify-center w-full drop-shadow-md overflow-hidden">
        {outputURI == null ? (
          <img src={inputURI} className="lg:h-5/6 md:w-auto w-full" />
        ) : (
          <ReactCompareSlider
            className="lg:h-5/6 m-1"
            position={50}
            itemOne={<ReactCompareSliderImage src={inputURI} alt="Image one" />}
            itemTwo={
              <ReactCompareSliderImage src={outputURI} alt="Image two" />
            }
          />
        )}
      </div>
  );
};

export default ImageDisplay;
