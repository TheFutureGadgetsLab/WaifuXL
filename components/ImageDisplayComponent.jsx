import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import {useEffect, useState} from 'react';

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}


const ImageDisplay = ({ outputURI, inputURI }) => {
  const size = useWindowSize();
  const [mobile, setMobile] = useState(false)
   useEffect(() => {
    setMobile((size.width / size.height) < 1.0)
   }, [size])
  return (
    <div className="h-5/6 flex items-center justify-center w-full drop-shadow-md overflow-hidden">
      {outputURI == null ? (
        <img
          src={inputURI}
          className="h-5/6 md:w-auto w-full"
          style={{
            width: mobile ? "75vw" : "75vh",
            height: mobile ? "75vw" : "75vh",
          }}
        />
      ) : (
        <ReactCompareSlider
          className="h-5/6 md:w-auto m-1"
          position={50}
          itemOne={<ReactCompareSliderImage src={inputURI} alt="Image one" />}
          itemTwo={<ReactCompareSliderImage src={outputURI} alt="Image two" />}
          style={{
            width: mobile ? "75vw" : "75vh",
            height: mobile ? "75vw" : "75vh",
          }}
        />
      )}
    </div>
  );
};

export default ImageDisplay;
