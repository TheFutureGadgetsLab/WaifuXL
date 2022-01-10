import { useEffect, useRef, useState } from "react";
import {
  getDataURIFromInput,
  getDataURIFromFileUpload,
} from "../services/imageUtilities";

function ModalComponent({
  setInputModalOpen,
  setInputURI,
  setOutputURI,
  inputURI,
  previewURI,
  setPreviewURI,
  setFileName,
  setTags,
}) {
  const divRef = useRef(null);

  function focusDiv() {
    divRef.current.focus();
  }

  useEffect(async () => {
    // Update the document title using the browser API
    focusDiv();
  }, [divRef]);

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-20"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      ref={divRef}
      onKeyDown={(e) => {
        setInputModalOpen(e.key != "Escape");
        setFileName();
      }}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <span className="block text-gray-700 pt-3">
            Click preview to open file dialogue
          </span>
          <label
            className="flex flex-col items-center justify-center cursor-pointer h-96 m-3 bg-contain bg-origin-content p-4 bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${previewURI})`,
              boxShadow: "inset 0px 0px 12px #00000050",
            }}
          >
            <label className="flex items-center px-4 py-6 tracking-wide cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  getDataURIFromFileUpload(e.target.files[0], setPreviewURI);
                  setFileName(e.target.files[0].name.split(".")[0]);
                  setOutputURI(null);
                }}
              />
            </label>
          </label>
          <div
            id="preset-menu"
            className="mt-10 p-3 flex justify-between relative"
          >
            <label>
              <span className="text-gray-700">Preset Images</span>
              <select
                id="preset-select"
                className="form-select rounded mt-1 block w-full p-3 bg-blue text-white"
                onInput={async (inp) => {
                  const [name, url] = inp.target.value.split("|");
                  setPreviewURI(await getDataURIFromInput(url));
                  setFileName(`example_${name}`);
                  setOutputURI(null);
                }}
              >
                <option value="ozen|https://i.imgur.com/Sf6sfPj.png">
                  Ozen "The Immovable"
                </option>
                <option value="moomin|https://i.imgur.com/9I91yMq.png">
                  Moomin
                </option>
                <option value="megumin|https://i.imgur.com/BKBt6bC.png">
                  Megumin
                </option>
                <option value="aqua|https://i.imgur.com/yhIwVjZ.jpeg">
                  Aqua
                </option>
                <option value="natsumi|https://i.imgur.com/yIIl7Z1.png">
                  Natsumi Kurobe
                </option>
              </select>
            </label>

            <button id="done-button"
              type="button"
              className="rounded-md absolute m-3 right-0 bottom-0 text-blue shadow-sm px-4 py-1 
                text-base font-medium h-12 focus:outline-none focus:ring-2 focus:ring-offset-2 
                border-blue border-2 bg-white hover:bg-blue hover:text-white"
              onClick={() => {
                setInputURI(previewURI);
                setOutputURI(null);
                setTags(null);
                setInputModalOpen(false);
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalComponent;
