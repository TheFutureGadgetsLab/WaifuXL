import { BLUE } from "../constants/colors";
import { buildNdarrayFromImage } from "../services/processingUtilities";

const RunComponent = ({ setImageInput, setShouldRun, canvasContext }) => {
  return (
    <button
      className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
      style={{ backgroundColor: BLUE }}
      onClick={() => {
        setImageInput(buildNdarrayFromImage(canvasContext));
        setShouldRun(true);
      }}
    >
      Upscale
    </button>
  );
};

export default RunComponent;
