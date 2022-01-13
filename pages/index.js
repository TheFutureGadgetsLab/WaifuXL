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
    console.log("Pushed")
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
        <div className="hidden md:flex md:w-1/8 md:flex-col md:fixed md:inset-y-0 z-10">
          <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="">
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
