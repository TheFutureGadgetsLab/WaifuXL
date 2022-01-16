import { useEffect, useRef, useState } from "react";
import {
  getDataURIFromInput,
  getDataURIFromFileUpload,
  checkDimensions,
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
  const [showWarning, setShowWarning] = useState(false);
  function focusDiv() {
    divRef.current.focus();
  }

  useEffect(async () => {
    // Update the document title using the browser API
    focusDiv();
  }, [divRef]);

  useEffect(async () => {
    setShowWarning(await checkDimensions(previewURI));
  }, [previewURI]);

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
          onClick={(e) => {
            setInputModalOpen(false);
            setFileName();
          }}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              className="mt-3 mr-3 float-right cursor-pointer"
              onClick={(e) => {
                setInputModalOpen(false);
                setFileName();
              }}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </div>
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
                  if (e.target.files[0]) {
                    getDataURIFromFileUpload(e.target.files[0], setPreviewURI);
                    setFileName(e.target.files[0].name.split(".")[0]);
                    setOutputURI(null);  
                  }
                }}
              />
            </label>
          </label>
          {showWarning ? (
            <span className="text-red-500 text-sm font-bold">Warning: Image is too large <br/> Max dimension: 950 x 950</span>
          ) : (
            <span className="text-sm">&#10240;<br/>&#10240;</span>
          )}
          <div
            id="preset-menu"
            className="mt-10 p-3 flex justify-between relative"
          >
            <label>
              <span className="text-gray-700">Preset Images</span>
              <select
                id="preset-select"
                className="form-select rounded mt-1 block w-full p-3 bg-blue text-white cursor-pointer"
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
                <option value="deku|https://c.tenor.com/mkunLNebofwAAAAC/anime-headbang.gif">
                  Deku Headbang (GIF)
                </option>
              </select>
            </label>

            <button
              id="done-button"
              type="button"
              className="rounded-md absolute m-3 right-0 bottom-0 text-blue shadow-sm px-4 py-1 
                text-base font-medium h-12 focus:outline-none focus:ring-2 focus:ring-offset-2 
                border-blue border-2 bg-white hover:bg-blue hover:text-white disabled:bg-white disabled:text-gray-200 disabled:border-gray-200"
              disabled={showWarning}
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
