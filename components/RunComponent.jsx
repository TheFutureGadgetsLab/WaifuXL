import { useEffect, useState } from "react";
import { upScaleFromURI } from "../services/processingUtilities";
import { initializeONNX } from "../services/onnxBackend";
const RunComponent = ({
  loading,
  setLoading,
  inputURI,
  setOutputURI,
  setTags,
  setExtension,
  setUserHasRun,
  upscaleFactor,
}) => {
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(async () => {
    if (shouldRun) {
      // Clear previous output
      setOutputURI(null);
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
        // Set should run to false
        setShouldRun(false);
      }
    }
  }, [shouldRun]);

  return (
    <button
      className={`grow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg inline-flex items-center bg-pink`}
      onClick={async () => {
        await initializeONNX();
        setShouldRun(true);
      }}
    >
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

      {loading ? ( // Button text
        <span> Upscaling... </span>
      ) : (
        <span> Upscale </span>
      )}
    </button>
  );
};

export default RunComponent;
