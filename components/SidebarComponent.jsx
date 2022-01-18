import DownloadComponent from "./DownloadComponent";
import RunComponent from "./RunComponent";
import InputComponent from "./InputComponent";
import TagComponent from "./TagComponent";
import Router from "next/router";

const Sidebar = ({
  inputModalOpen,
  setInputModalOpen,
  setInputURI,
  setOutputURI,
  inputURI,
  previewURI,
  setPreviewURI,
  setFileName,
  setTags,
  setUpscaleProgress,
  outputURI,
  fileName,
  extension,
  setLoading,
  isInitialized,
  setExtension,
  showSidebar,
  tags,
}) => {
  return (
    <div
      id="sidebar"
      className={`w-80 flex flex-col fixed inset-y-0 z-10 transition-transform`}
      style={{transform: `translateX(${showSidebar ? 0 : -100}%)`}}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="">
            <div className="pt-5 mt-10 mb-10 mx-8 space-y-2 grid grid-cols-1">
              <div
                className="md:hidden flex items-center space-x-2"
                onClick={() => Router.push("./about")}
              >
                <span className="text-2xl font-semibold text-black cursor-pointer">
                  About
                </span>
              </div>
              <div
                className="md:hidden flex items-center space-x-2"
                onClick={() => Router.push("./donate")}
              >
                <span className="text-2xl font-semibold text-black cursor-pointer">
                  Donate
                </span>
              </div>
              <hr className="md:hidden"/>

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
                setUpscaleProgress={setUpscaleProgress}
              />
              {outputURI != null ? (
                <DownloadComponent
                  inputURI={inputURI}
                  outputURI={outputURI}
                  fileName={fileName}
                  extension={extension}
                />
              ) : (
                <RunComponent
                  setLoading={setLoading}
                  inputURI={inputURI}
                  setOutputURI={setOutputURI}
                  setTags={setTags}
                  isInitialized={isInitialized}
                  setUpscaleProgress={setUpscaleProgress}
                  setExtension={setExtension}
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
  );
};

export default Sidebar;
