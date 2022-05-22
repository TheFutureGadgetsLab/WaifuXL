import { useEffect, useState } from "react";
import { upScaleFromURI } from "../services/processingUtilities";
import { initializeONNX } from "../services/onnxBackend";
import { uploadToImgur } from "../services/miscUtils";
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
      className={`grow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
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

      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#FFFFFF"
        className="w-6 h-6 mr-2"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z" />
      </svg>

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
