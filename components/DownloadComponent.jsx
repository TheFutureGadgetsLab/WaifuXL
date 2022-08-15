import { downloadImage } from "../services/imageUtilities";
import { DownloadSVG } from "./SVGComponents";

const DownloadComponent = ({ outputURI, fileName, extension }) => {
  return (
    <button
      className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center"
      onClick={() => downloadImage(outputURI, fileName, extension)}
    >
      <DownloadSVG />{" "}
      <span>Download Upscaled</span>
    </button>
  );
};

export default DownloadComponent;
