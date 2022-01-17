import {
    ReactCompareSlider,
    ReactCompareSliderImage,
  } from "react-compare-slider";
  
const ImageDisplay = ({ outputURI, inputURI }) => {
  return (
      <div className="h-5/6 flex items-center justify-center">
        {outputURI == null ? (
          <img src={inputURI} className="border-pink border-4 lg:h-4/6" />
        ) : (
          <ReactCompareSlider
            className="border-pink border-4 lg:h-4/6"
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
