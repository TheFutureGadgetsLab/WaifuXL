import { downloadImage } from "../services/imageUtilities";

const DownloadComponent = ({ inputURI, outputURI, fileName }) => {
  return (
    <button
      className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center"
      onClick={() => downloadImage("2x", inputURI, outputURI, fileName)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 24 24"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#FFFFFF"
        className="w-6 h-6 mr-2"
      >
        <g>
          <rect fill="none" height="24" width="24" />
        </g>
        <g>
          <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" />
        </g>
      </svg>{" "}
      <span>Download Upscaled </span>
    </button>
  );
};

export default DownloadComponent;
