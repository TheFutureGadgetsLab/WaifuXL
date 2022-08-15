import { useEffect, useState } from "react";
import { upScaleFromURI } from "../services/processingUtilities";
import { initializeONNX } from "../services/onnxBackend";
import { uploadToImgur } from "../services/miscUtils";
import { UpscaleSVG } from "./SVGComponents";
const RunComponent = ({
  loading,
  setLoading,
  inputURI,
  setOutputURI,
  setTags,
  setExtension,
  setUserHasRun,
  upscaleFactor,
  setModelLoading,
  modelLoading,
  setUpscaleFactor,
  setErrorMessage,
}) => {
  const [shouldRun, setShouldRun] = useState(false);
  const [modelLoadProg, setModelLoadProg] = useState(0);

  useEffect(async () => {
    if (shouldRun) {
      // Clear previous output
      setOutputURI(null);
      try {
        const result = await upScaleFromURI(
          inputURI,
          setLoading,
          setTags,
          setExtension,
          upscaleFactor
        );
        setUserHasRun(true);
        // If the models output is valid
        if (result) {
          //set the output
          setOutputURI(result);
          // await uploadToImgur(result);
          // Set should run to false
          setShouldRun(false);
          setUpscaleFactor(2);

          //hit the api and note an image has been upscaled
          var requestOptions = {
            method: "GET",
            redirect: "follow",
          };

          fetch(
            "https://waifuxl_upscale_counter.haydnjonest8327.workers.dev/increment",
            requestOptions
          ).catch((error) => console.log("Error incrementing counter"));
        }
      } catch (error) {
        setShouldRun(false);
        setUpscaleFactor(2);
        setErrorMessage("Model failed to run.");
      }
    }
  }, [shouldRun]);

  return (
    <button
      className={`grow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded relative
        drop-shadow-lg inline-flex items-center ${(!modelLoading && !loading) ? "bg-pink" : "bg-gray-300"}`}
      onClick={async () => {
        setModelLoading(true);
        try {
          await initializeONNX(setModelLoadProg);
          setModelLoading(false);
          setShouldRun(true);
        } catch (error) {
          setErrorMessage("Could not load model.");
        }
      }}
    >
      { modelLoading && // Model downloading progress displayed underneath button
        (<div id="upscale-button-bg" className="bg-litepink absolute h-full left-0 rounded duration-300"
          style={{width: `${modelLoadProg * 100}%`, zIndex: -1, transitionProperty: "width"}}></div>)
      }

      <UpscaleSVG />

      { loading ? // Button text
        (<span> Upscaling... </span>) :
        (!modelLoading ?
          (<span> Upscale </span>) :
          (<span> Loading Model </span>))
      }
    </button>
  );
};

export default RunComponent;
