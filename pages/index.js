import { initializeONNX } from "../services/onnxBackend";
import NavbarComponent from "../components/NavbarComponent";
import TitleComponent from "../components/TitleComponent";
import { useState, useEffect } from "react";
import Sidebar from "../components/SidebarComponent";
import ScreenIcons from "../components/ScreenIconsComponent";
import ImageDisplay from "../components/ImageDisplayComponent";
import { setEventListeners } from "../services/setEventListeners";

export default function Main() {
  const [inputURI, setInputURI] = useState("./ozen.png");
  const [outputURI, setOutputURI] = useState("./ozen_2x.png");
  const [previewURI, setPreviewURI] = useState("/ozen.png");
  const [loading, setLoading] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [tags, setTags] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [upscaleProgress, setUpscaleProgress] = useState(null);
  const [extension, setExtension] = useState("png");

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
    setEventListeners(
      setPreviewURI,
      setFileName,
      setShowSidebar,
      setInputModalOpen
    );
    await initializeONNX();
    setIsInitialized(true);
    setInputURI("./ozen.png");
    setOutputURI("./ozen_2x.png");
  }, []);

  return (
    <>
      <div
        style={{
          backgroundImage: `url("bg.svg")`,
          backgroundSize: "cover",
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
          isInitialized={isInitialized}
          setExtension={setExtension}
          showSidebar={showSidebar}
          tags={tags}
        />
        {/* Image display, title, navbar */}
        <main className="flex-1">
          <div className="flex flex-col items-center h-screen w-screen relative">
            <NavbarComponent />
            <ScreenIcons
              setShowSidebar={setShowSidebar}
              showSidebar={showSidebar}
            />
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
