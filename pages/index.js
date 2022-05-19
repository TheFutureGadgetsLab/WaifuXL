import NavbarComponent from "../components/NavbarComponent";
import TitleComponent from "../components/TitleComponent";
import { useState, useEffect } from "react";
import Sidebar from "../components/SidebarComponent";
import ImageDisplay from "../components/ImageDisplayComponent";
import { setEventListeners } from "../services/setEventListeners";
import default_tags from "../services/landing_tags";
export default function Main() {
  const [inputURI, setInputURI] = useState("./images/ozen.png");
  const [outputURI, setOutputURI] = useState("./images/ozen_2x.png");
  const [previewURI, setPreviewURI] = useState("/images/ozen.png");
  const [loading, setLoading] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [tags, setTags] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [extension, setExtension] = useState("png");
  const [upscaleFactor, setUpscaleFactor] = useState(2);
  const [userHasRun, setUserHasRun] = useState(false);
  const [fileName, _setFileName] = useState("example");
  const [modelLoading, setModelLoading] = useState(false);

  var lastFileName = fileName;

  function setFileName(name = null) {
    if (name == null) {
      name = lastFileName;
    } else {
      lastFileName = name;
    }
    _setFileName(`${name}_${upscaleFactor}x`);
  }

  useEffect(async () => {
    setInputURI("./images/ozen.png");
    setOutputURI("./images/ozen_2x.png");
    setTags(default_tags);
    setEventListeners(
      setPreviewURI,
      setFileName,
      setShowSidebar,
      setInputModalOpen
    );
  }, []);

  return (
    <>
      <div
        style={{
          backgroundImage: `url("images/bg.svg")`,
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
          outputURI={outputURI}
          fileName={fileName}
          extension={extension}
          setLoading={setLoading}
          loading={loading}
          setExtension={setExtension}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          tags={tags}
          setUserHasRun={setUserHasRun}
          upscaleFactor={upscaleFactor}
          setUpscaleFactor={setUpscaleFactor}
          modelLoading={modelLoading}
          setModelLoading={setModelLoading}
        />
        {/* Image display, title, navbar */}
        <main className="flex-1">
          <div className="flex flex-col items-center h-screen w-screen relative">
            <NavbarComponent currentPage="index" />
            <div className="h-full grow w-full">
              <ImageDisplay inputURI={inputURI} outputURI={outputURI} />
              <TitleComponent
                loading={loading}
                downloadReady={outputURI != null && userHasRun}
                modelLoading={modelLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
