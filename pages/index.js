import { getDataURIFromInput } from "../services/imageUtilities";
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
  const [loading, setLoading] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [tags, setTags] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(async () => {
    document.body.style.overflow = "hidden";
    await initializeONNX();
    setIsInitialized(true);
    //note: this is the input logic (given some from of URI)
    setInputURI(await getDataURIFromInput(inputURI));
  }, []);

  return (
    <>
      <div>
        <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="">
                <div className="mt-10 mb-10 mx-8 space-y-2 grid grid-cols-1">
                  <InputComponent
                    inputModalOpen={inputModalOpen}
                    setInputModalOpen={setInputModalOpen}
                    setInputURI={setInputURI}
                    setOutputURI={setOutputURI}
                  />
                  {outputURI != null ? (
                    <DownloadComponent
                      inputURI={inputURI}
                      outputURI={outputURI}
                    />
                  ) : (
                    isInitialized && (
                      <RunComponent
                        setLoading={setLoading}
                        inputURI={inputURI}
                        setOutputURI={setOutputURI}
                        setTags={setTags}
                      />
                    )
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
        <div className="flex flex-col">
          <main className="flex-1">
            <div className="py-6">
              <div
                className="flex flex-col items-center min-h-screen z-0"
                style={{
                  backgroundImage: `url("bg.svg")`,
                  backgroundSize: "cover",
                }}
              >
                <NavbarComponent />
                <div className="flex h-screen items-center justify-center drop-shadow-2xl">
                  {outputURI == null ? (
                    <img
                      src={inputURI}
                      className={"border-pink h-4/6"}
                      style={{
                        borderWidth: "4px",
                        backgroundColor: "white",
                      }}
                    />
                  ) : (
                    <ReactCompareSlider
                      className={"border-pink h-4/6"}
                      style={{
                        borderWidth: "4px",
                        backgroundColor: "white",
                      }}
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
