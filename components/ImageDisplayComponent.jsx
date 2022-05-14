import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const ImageDisplay = ({ outputURI, inputURI }) => {
  return (
    <div className="h-5/6 flex items-center justify-center w-full drop-shadow-md overflow-hidden">
      {outputURI == null ? (
        <img src={inputURI} className="h-5/6 md:w-auto w-full" />
      ) : (
        <ReactCompareSlider
          className="h-5/6 md:w-auto m-1"
          position={50}
          itemOne={<ReactCompareSliderImage src={inputURI} alt="Image one" />}
          itemTwo={
            <ReactCompareSliderImage src={outputURI} alt="Image two" />
          }
          style={{
            width:"75vh",
            height:"75vh"
          }}
        />
      )}
    </div>
  );
};

export default ImageDisplay;
