import {
    downloadImage,
  } from "../services/imageUtilities";
  
  const DownloadComponent = ({
        inputURI,
        outputURI
    }) => {
    return (
      <div className="flex-shrink grid grid-cols-2 justify-items-center px-10 text-center w-full max-w-6xl">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-brown"
          onClick={() => downloadImage("original", inputURI, inputURI)}
        >
          Download Original
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-brown"
          onClick={() => downloadImage("2x", inputURI, outputURI)}
        >
          Download Upscaled
        </button>
      </div>
    );
  };
  
  export default DownloadComponent;
  