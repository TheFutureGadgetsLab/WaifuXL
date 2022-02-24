import { initializeONNX } from "../services/onnxBackend";
import NavbarComponent from "../components/NavbarComponent";
import TitleComponent from "../components/TitleComponent";
import { useState, useEffect } from "react";
import Sidebar from "../components/SidebarComponent";
import ImageDisplay from "../components/ImageDisplayComponent";
import { setEventListeners } from "../services/setEventListeners";
import { upscaleIncrementProgress, upscaleEstFreq } from "../services/processingUtilities";
import InProgress from "../components/inprogress.jsx";
export default function Main() {
  const [inputURI, setInputURI] = useState("./ozen.png");
  const [outputURI, setOutputURI] = useState("./ozen_2x.png");
  const [previewURI, setPreviewURI] = useState("/ozen.png");
  const [loading, setLoading] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [tags, setTags] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [upscaleIncIntervalID, setUpscaleIncIntervalID] = useState(null);
  const [upscaleProgress, setUpscaleProgress] = useState(0);
  const [extension, setExtension] = useState("png");
  const [upscaleFactor, setUpscaleFactor] = useState(2);
  const [userHasRun, setUserHasRun] = useState(false);
  const [fileName, _setFileName] = useState("example");

  var lastFileName = fileName;

  function setFileName(name = null) {
    if (name == null) {
      name = lastFileName;
    } else {
      lastFileName = name;
    }
    _setFileName(`${name}_${upscaleFactor}x`);
    console.debug("set filename to", name);
  }

  useEffect(async () => {
    setInputURI("./ozen.png");
    setOutputURI("./ozen_2x.png");
    setEventListeners(
      setPreviewURI,
      setFileName,
      setShowSidebar,
      setInputModalOpen
    );
    await initializeONNX(setInitProgress);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (upscaleIncIntervalID != null) {
      clearInterval(upscaleIncIntervalID);
      setUpscaleIncIntervalID(null);
    }
    if (loading) {
      setUpscaleIncIntervalID(setInterval(
        upscaleIncrementProgress, upscaleEstFreq * 1000, upscaleProgress, setUpscaleProgress));
    }
  }, [loading, upscaleProgress]);

  return (
    <>
      <div
        style={{
          backgroundImage: `url("bg.svg")`,
          backgroundSize: "cover",
          backgroundPositionX: "right",
        }}
      >
        <Sidebar
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
          outputURI={outputURI}
          fileName={fileName}
          extension={extension}
          setLoading={setLoading}
          loading={loading}
          isInitialized={isInitialized}
          setExtension={setExtension}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          tags={tags}
          initProgress={initProgress}
          setUserHasRun={setUserHasRun}
          upscaleFactor={upscaleFactor}
          setUpscaleFactor={setUpscaleFactor}
        />
        {/* Image display, title, navbar */}
        <main className="flex-1">
          <div className="flex flex-col items-center h-screen w-screen relative">
            <InProgress />
            <NavbarComponent currentPage="index" />
            <div className="h-full grow w-full">
              <ImageDisplay inputURI={inputURI} outputURI={outputURI} />
              <TitleComponent
                loading={loading}
                upscaleProgress={upscaleProgress}
                downloadReady={outputURI != null && userHasRun}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
