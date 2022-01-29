import DownloadComponent from "./DownloadComponent";
import RunComponent from "./RunComponent";
import InputComponent from "./InputComponent";
import TagComponent from "./TagComponent";
import Router from "next/router";
import ScreenIcons from "./ScreenIconsComponent";
import ModalComponent from "./ModalComponent";

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
  loading,
  isInitialized,
  setExtension,
  showSidebar,
  setShowSidebar,
  tags,
  initProgress,
  setUpscaleCount,
}) => {
  return (
    <div id="sidebar" className="w-80 flex flex-col fixed inset-y-0 z-20">
      <div
        className="relative flex-1 flex flex-col min-h-0 bg-gray-100 transition-all"
        style={{ left: `${showSidebar ? 0 : -100}%` }}
      >
        <ScreenIcons
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="">
            <div className="pt-5 mt-10 mb-10 mx-8 grid grid-cols-1 space-y-2">
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
              <hr className="md:hidden" />

              <InputComponent
                setInputModalOpen={setInputModalOpen}
              />
              {outputURI != null ? (
                <DownloadComponent
                  inputURI={inputURI}
                  outputURI={outputURI}
                  fileName={fileName}
                  extension={extension}
                />
              ) : (
                <div id="upscale-button-container"
                  className="flex justify-between gap-2">
                  <RunComponent
                    loading={loading}
                    setLoading={setLoading}
                    inputURI={inputURI}
                    setOutputURI={setOutputURI}
                    setTags={setTags}
                    isInitialized={isInitialized}
                    setUpscaleProgress={setUpscaleProgress}
                    setExtension={setExtension}
                    initProgress={initProgress}
                    setUpscaleCount={setUpscaleCount}
                  />
                  <select id="resolution-select"
                    className="form-select appearance-none border-none text-white font-bold py-2 px-4
                      rounded drop-shadow-lg bg-pink inline-flex items-center w-16">
                    <option>2&#215;</option>
                    <option>4&#215;</option>
                    <option>8&#215;</option>
                  </select>
                </div>
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
      {inputModalOpen && (
        <ModalComponent
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
      )}
    </div>
  );
};

export default Sidebar;
