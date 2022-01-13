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
  const [inputURI, setInputURI] = useState("https://i.imgur.com/Sf6sfPj.png");
  const [outputURI, setOutputURI] = useState(null);
  const [previewURI, setPreviewURI] = useState(
    "https://i.imgur.com/Sf6sfPj.png"
  );
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
    document.body.style.overflow = "hidden";
    console.log("Pushed");
    setInputURI(await getDataURIFromInput(inputURI));
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
        setInputModalOpen(true);
      }
    });
  }, []);

  return (
    <>
      <div>
        {showSidebar && (
          <div className="w-80 flex flex-col fixed inset-y-0 z-10">
            <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                    className="mt-3 mr-3 float-right"
                    onClick={(e) => {
                      setShowSidebar(false);
                    }}
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>

                  <div className="mt-10 mb-10 mx-8 space-y-2 grid grid-cols-1">
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
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                  className="absolute left-10 top-3"
                  onClick={e => setShowSidebar(true)}
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
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
