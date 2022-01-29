import { initializeONNX } from "../services/onnxBackend";
import NavbarComponent from "../components/NavbarComponent";
import TitleComponent from "../components/TitleComponent";
import { useState, useEffect } from "react";
import Sidebar from "../components/SidebarComponent";
import ImageDisplay from "../components/ImageDisplayComponent";
import { setEventListeners } from "../services/setEventListeners";
import { upscaleIncrementProgress, upscaleEstFreq } from "../services/processingUtilities";

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
  const [upscaleFactor, setUpscaleFactor] = useState(0);

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
        />
        {/* Image display, title, navbar */}
        <main className="flex-1">
          <div className="flex flex-col items-center h-screen w-screen relative">
            <NavbarComponent currentPage="index" />
            <div className="h-full grow w-full">
              <ImageDisplay inputURI={inputURI} outputURI={outputURI} />
              <TitleComponent
                loading={loading}
                upscaleProgress={upscaleProgress}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
