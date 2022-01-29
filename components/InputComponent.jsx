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
        <svg
          xmlns="http://www.w3.org/2000/svg"
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
            <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z" />
          </g>
        </svg>{" "}
        <span>Choose Image/Gif</span>
      </button>
    </>
  );
};

export default InputComponent;
