import { useEffect, useState } from "react";
import { BLUE } from "../constants/colors";
import { buildNdarrayFromImage } from "../services/processingUtilities";
import { runModel } from "../services/onnxBackend";
import { drawOutput, clearOutput } from "../services/imageUtilities";

const RunComponent = ({ canvasContext, outputCanvasContext, setShowDownloads, setLoading, setHeight, setWidth, height, width }) => {
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(async () => {
    if (shouldRun) {
      // Clear previous output
      clearOutput(outputCanvasContext);
      // Run the model
      const tmp = await runModel(
        buildNdarrayFromImage(canvasContext),
        setLoading
      );
      // If the models output is valid
      if (tmp) {
        // Draw the model output onto the output canvas
        drawOutput(outputCanvasContext, tmp, setHeight, setWidth, height, width);
        // Show the download buttons
        setShowDownloads(true);
        // Set should run to false
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
