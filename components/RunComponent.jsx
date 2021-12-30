import { useEffect, useState } from "react";
import { upScaleFromURI } from "../services/processingUtilities";

const RunComponent = ({ setLoading, inputURI, setOutputURI }) => {
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(async () => {
    if (shouldRun) {
      // Clear previous output
      setOutputURI(null);
      const result = await upScaleFromURI(inputURI, setLoading);
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
      className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-blue"
      onClick={() => {
        setShouldRun(true);
      }}
    >
      Upscale
    </button>
  );
};

export default RunComponent;
