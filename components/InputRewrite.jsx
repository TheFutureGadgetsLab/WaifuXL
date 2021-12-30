import ModalComponent from "../components/ModalRewrite";
const InputComponent = ({ inputModalOpen, setInputModalOpen, setInputURI, setOutputURI }) => {
  return (
    <>
      {inputModalOpen && (
        <ModalComponent
          setInputModalOpen={setInputModalOpen}
          setInputURI={setInputURI}
          setOutputURI={setOutputURI}
        />
      )}
      <button
        type="button"
        className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-blue"
        onClick={() => setInputModalOpen(true)}
      >
        Choose Image
      </button>
    </>
  );
};

export default InputComponent;
