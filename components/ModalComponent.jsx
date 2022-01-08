import { useEffect, useRef } from "react";
import {
  getDataURIFromInput,
  getDataURIFromFileUpload,
} from "../services/imageUtilities";

function ModalComponent({ setInputModalOpen, setInputURI, setOutputURI, inputURI }) {
  const divRef = useRef(null);

  function focusDiv() {
    divRef.current.focus();
  }

  useEffect(async () => {
    // Update the document title using the browser API
    focusDiv();
    document.addEventListener("paste", async (e) => {
      if (e.clipboardData.getData("text/plain")) {
        setInputURI(
          await getDataURIFromInput(e.clipboardData.getData("text/plain"))
        );
      } else {
        try {
          var items = (e.clipboardData || e.originalEvent.clipboardData).items;
          for (var index in items) {
            var item = items[index];
            if (item.kind === "file") {
              var blob = item.getAsFile();
              getDataURIFromFileUpload(blob, setInputURI);
            }
          }
        } catch {
          console.log("Unrecognized paste");
        }
      }
    });
  }, [divRef]);

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      ref={divRef}
      onPaste={async (e) => {
        if (e.clipboardData.getData("text/plain")) {
          setInputURI(
            await getDataURIFromInput(e.clipboardData.getData("text/plain"))
          );
        } else {
          try {
            var items = (e.clipboardData || e.originalEvent.clipboardData)
              .items;
            for (var index in items) {
              var item = items[index];
              if (item.kind === "file") {
                var blob = item.getAsFile();
                getDataURIFromFileUpload(blob, setInputURI);
              }
            }
          } catch {
            console.log("Unrecognized paste");
          }
        }
      }}
      onKeyDown={(e) => {
        setInputModalOpen(e.key != "Escape");
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

        <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <label className="flex flex-col items-center justify-center cursor-pointer h-96 m-3">
            <label className="flex-col flex items-center px-4 py-6 tracking-wide cursor-pointer">
              {/* <span className="mt-2 text-gray-400">
                select, drag, or paste file
              </span>
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg> */}
              <img
                src={inputURI}
                className={"mt-10 drop-shadow-2xl border-pink border-2"}
              />

              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  getDataURIFromFileUpload(e.target.files[0], setInputURI);
                  setOutputURI(null);
                }}
              />
            </label>
          </label>
          <div className="mt-10 p-3 flex justify-between relative">
            <label>
              <span className="text-gray-700">Preset Images</span>
              <select
                className="form-select rounded mt-1 block w-full p-3 text-white bg-pink"
                onInput={async (inp) => {
                  setInputURI(await getDataURIFromInput(inp.target.value));
                  setOutputURI(null);
                }}
              >
                <option value="https://i.imgur.com/Sf6sfPj.png">
                  Ozen (Best Girl)
                </option>
                <option value="https://i.imgur.com/v9Lwral.png">
                  Megumin (Literally a child)
                </option>
                <option value="https://i.imgur.com/lgTo3BX.png">
                  Megumin (small) (Age is just a number)
                </option>
                <option value="https://i.imgur.com/yhIwVjZ.jpeg">
                  Aqua (Best Girl)
                </option>
                <option value="https://i.imgur.com/9MQHsx8.jpeg">
                  Darkness (Worst Girl)
                </option>
              </select>
            </label>

            <button
              type="button"
              className="rounded-md absolute m-3 right-0 bottom-0 border border-transparent shadow-sm px-4 py-1 text-base font-medium text-white h-12 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue"
              onClick={() => setInputModalOpen(false)}
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
