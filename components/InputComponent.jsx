import { UploadSVG } from "./SVGComponents";

const InputComponent = ({
  setInputModalOpen,
}) => {
  return (
    <>
      <button id="choose-image-button"
        type="button"
        className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center"
        onClick={() => setInputModalOpen(true)}
      >
        <UploadSVG />{" "}
        <span>Choose Image/GIF</span>
      </button>
    </>
  );
};

export default InputComponent;
