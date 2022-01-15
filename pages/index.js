import {
  getDataURIFromInput,
  getDataURIFromFileUpload,
} from "../services/imageUtilities";
import { initializeONNX } from "../services/onnxBackend";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import NavbarComponent from "../components/NavbarComponent";
import TitleComponent from "../components/TitleComponent";
import DownloadComponent from "../components/DownloadComponent";
import RunComponent from "../components/RunComponent";
import InputComponent from "../components/InputComponent";
import TagComponent from "../components/TagComponent";
import { useState, useEffect } from "react";
export default function Example() {
  const [inputURI, setInputURI] = useState("./ozen.png");
  const [outputURI, setOutputURI] = useState(null);
  const [previewURI, setPreviewURI] = useState("/ozen.png");
  const [loading, setLoading] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [tags, setTags] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  var fileName = null;
  var lastFileName = null;

  function setFileName(name = null) {
    if (name == null) {
      fileName = lastFileName;
    } else {
      fileName = name;
    }
    console.debug("set filename to", fileName);
  }

  useEffect(async () => {
    // const initialURI = require("ozenURL.json");
    document.body.style.overflow = "hidden";
    setInputURI(await getDataURIFromInput("/ozen.png"));
    await initializeONNX();
    setIsInitialized(true);
    //note: this is the input logic (given some from of URI)

    function handleInputFile(items) {
      try {
        for (let index in items) {
          let item = items[index];
          if (item.kind === "file") {
            let file = item.getAsFile();
            setFileName(file.name.split("/").at(-1).split(".")[0]);
            getDataURIFromFileUpload(file, setPreviewURI);
            return true;
          }
        }
      } catch (e) {
        console.error(e);
        console.error("Unable to handle input image");
        return false;
      }
    }

    document.addEventListener("paste", async (e) => {
      console.debug(e);
      let success = false;
      if (e.clipboardData.getData("text/plain")) {
        let url = e.clipboardData.getData("text/plain");
        setPreviewURI(await getDataURIFromInput(url));
        setFileName(url.split("/").at(-1).split(".")[0]);
        success = true;
      } else {
        success = handleInputFile(
          (e.clipboardData || e.originalEvent.clipboardData).items
        );
      }
      if (success) {
        setShowSidebar(true);
        setInputModalOpen(true);
      }
    });

    document.addEventListener("dragenter", (e) => {
      e.preventDefault();
    });
    document.addEventListener("drag", (e) => {
      e.preventDefault();
    });
    document.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    });
    document.addEventListener("dragend", (e) => {
      e.preventDefault();
    });
    document.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });

    document.addEventListener("drop", async (e) => {
      console.debug("drop event");
      e.preventDefault();
      e.stopPropagation();
      let success = handleInputFile(e.dataTransfer.items);
      if (success) {
        setShowSidebar(true);
        setInputModalOpen(true);
      }
    });
  }, []);

  return (
    <>
      <div>
        {showSidebar && (
          <div id="sidebar" className="w-80 flex flex-col fixed inset-y-0 z-10">
            <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="">
                  <div className="pt-5 mt-10 mb-10 mx-8 space-y-2 grid grid-cols-1">
                    <InputComponent
                      inputModalOpen={inputModalOpen}
                      setInputModalOpen={setInputModalOpen}
                      setInputURI={setInputURI}
                      setOutputURI={setOutputURI}
                      inputURI={inputURI}
                      previewURI={previewURI}
                      setPreviewURI={setPreviewURI}
                      setFileName={setFileName}
                      setTags={setTags}
                    />
                    {outputURI != null ? (
                      <DownloadComponent
                        inputURI={inputURI}
                        outputURI={outputURI}
                        fileName={fileName}
                      />
                    ) : (
                      <RunComponent
                        setLoading={setLoading}
                        inputURI={inputURI}
                        setOutputURI={setOutputURI}
                        setTags={setTags}
                        isInitialized={isInitialized}
                      />
                    )}
                  </div>
                  {tags != null && (
                    <>
                      <hr />
                      <div className="mt-10 mx-3 space-y-2 grid grid-cols-1">
                        <TagComponent tags={tags} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image display, title, navbar */}
        <div className="flex flex-col">
          <main className="flex-1">
            <div className="">
              <div
                className="flex flex-col items-center min-h-screen relative"
                style={{
                  backgroundImage: `url("bg.svg")`,
                  backgroundSize: "cover",
                }}
              >
                <NavbarComponent />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="32px"
                  viewBox="0 0 24 24"
                  width="32px"
                  fill="#000000"
                  className="absolute left-5 top-4 z-40 cursor-pointer"
                  onClick={(e) => setShowSidebar(!showSidebar)}
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
                <a href="https://github.com/TheFutureGadgetsLab/WaifuXL">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="absolute right-5 top-4 z-40"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <div className="flex h-screen items-center justify-center">
                  {outputURI == null ? (
                    <img
                      src={inputURI}
                      className={"border-pink border-4 h-4/6"}
                    />
                  ) : (
                    <ReactCompareSlider
                      className={"border-pink border-4 h-4/6"}
                      itemOne={
                        <ReactCompareSliderImage
                          src={inputURI}
                          alt="Image one"
                        />
                      }
                      itemTwo={
                        <ReactCompareSliderImage
                          src={outputURI}
                          alt="Image two"
                        />
                      }
                    />
                  )}
                </div>
                <div className="absolute bottom-0">
                  <TitleComponent loading={loading} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
