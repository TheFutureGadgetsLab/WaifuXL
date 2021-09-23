import { getImageFromFileUpload } from "../services/imageUtilities";
import { BLUE } from "../constants/colors";

function ModalComponent({
  setOpen,
  canvasContexts,
  setHeight,
  setWidth,
  url,
  setShowDownloads,
  setUrl,
}) {
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <label className="flex flex-col items-center justify-center cursor-pointer hover:bg-blue p-32">
            <label className="flex-col flex items-center px-4 py-6 bg-white text-blue tracking-wide uppercase cursor-pointer hover:bg-blue">
              <span className="mt-2 text-base leading-normal">
                Select a file
              </span>
              <svg
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  getImageFromFileUpload(
                    e.target.files[0],
                    canvasContexts,
                    setHeight,
                    setWidth
                  );
                  setShowDownloads(false);
                }}
              />
            </label>
          </label>
          <div className="px-4 py-3 px-6 flex justify-between">
            <label>
              <span className="text-gray-700">Preset Images</span>
              <select
                className="form-select rounded mt-1 block w-full"
                onInput={(inp) => {
                  setUrl(inp.target.value);
                }}
              >
                <option value="https://i.imgur.com/Sf6sfPj.png">
                  Ozen (Best Girl)
                </option>
                <option value="https://i.imgur.com/v9Lwral.png">
                  Megumin (Literally a child)
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
              className="rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: BLUE }}
              onClick={() => setOpen(false)}
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
