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
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Upload Image
                </h3>
                <div className="mt-2">
                  <input
                    type="file"
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
                  <input
                    className="bg-gray-200 shadow-inner rounded-l"
                    id="image-url"
                    placeholder={url}
                    onBlur={(inp) => {
                      setUrl(inp.target.value);
                    }}
                    list="defaultOptions"
                  />
                  <datalist id="defaultOptions">
                    <option value="https://i.imgur.com/v9Lwral.png">
                      Megumin (Literally a child)
                    </option>
                    <option value="https://i.imgur.com/yhIwVjZ.jpeg">
                      Aqua (Best Girl)
                    </option>
                    <option value="https://i.imgur.com/9MQHsx8.jpeg">
                      Darkness (Worst Girl)
                    </option>
                    <option value="https://i.imgur.com/Sf6sfPj.png">
                      Ozen (Best Girl)
                    </option>
                  </datalist>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              style={{ backgroundColor: BLUE }}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalComponent;
