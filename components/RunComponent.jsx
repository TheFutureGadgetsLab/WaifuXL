import { useEffect, useState } from "react";
import { BLUE } from "../constants/colors";
import { buildNdarrayFromImage } from "../services/processingUtilities";
import { runModel } from "../services/onnxBackend";
import { drawOutput } from "../services/imageUtilities";

const RunComponent = ({ canvasContext, outputCanvasContext, setShowDownloads, setLoading, setOutHeight, setOutWidth }) => {
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(async () => {
    if (shouldRun) {
      //run the model
      const tmp = await runModel(
        buildNdarrayFromImage(canvasContext),
        setLoading
      );
      //if the models output is valid
      if (tmp) {
        //draw the model output onto the output canvas
        drawOutput(outputCanvasContext, tmp, setOutHeight, setOutWidth);
        //show the download buttons
        setShowDownloads(true);
        //set should run to false
        setShouldRun(false);
      }
    }
  }, [shouldRun]);

  return (
    <button
      className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
      style={{ backgroundColor: BLUE }}
      onClick={() => {
        setShouldRun(true);
      }}
    >
      Upscale
    </button>
  );
};

export default RunComponent;
