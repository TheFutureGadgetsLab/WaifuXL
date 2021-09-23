import { useState, useEffect, createRef } from "react";
import { drawImage, drawOutput } from "../services/imageUtilities";
import { initializeONNX, runModel } from "../services/onnxBackend";

import CanvasComponent from "../components/CanvasComponent";
import DownloadComponent from "../components/DownloadComponent";
import HeroComponent from "../components/HeroComponent";
import InputComponent from "../components/InputComponent";
import RunComponent from "../components/RunComponent";

export default function Home() {
  const [canvasContext, setCanvasContext] = useState(undefined);
  const [outputCanvasContext, setOutputCanvasContext] = useState(undefined);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [outHeight, setOutHeight] = useState(500);
  const [outWidth, setOutWidth] = useState(500);
  const [loading, setLoading] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [imageInput, setImageInput] = useState(undefined);
  const [url, setUrl] = useState("https://i.imgur.com/Sf6sfPj.png");
  const [drawnURL, setDrawnURL] = useState("");
  const [shouldRun, setShouldRun] = useState(false);
  const [model, setModel] = useState("identity");
  const loadingLink = "https://i.4pcdn.org/pol/1552671673728.gif";
  const canvasRef = createRef();
  const outputCanvasRef = createRef();

  useEffect(async () => {
    setCanvasContext(canvasRef.current.getContext("2d"));
    setOutputCanvasContext(outputCanvasRef.current.getContext("2d"));
    if (canvasContext && outputCanvasContext && drawnURL !== url) {
      drawImage(
        canvasContext,
        url,
        setHeight,
        setWidth,
        setOutHeight,
        setOutWidth
      );
      outputCanvasContext.clearRect(0, 0, outWidth, outHeight);
      setDrawnURL(url);
      setShowDownloads(false);
    }
    if (shouldRun) {
      const tmp = await runModel(imageInput, model, setLoading);
      if (tmp) {
        drawOutput(outputCanvasContext, tmp, setOutHeight, setOutWidth);
        setShowDownloads(true);
        setShouldRun(false);
      }
    }
  }, [height, width, imageInput, canvasContext, url]);

  useEffect(async () => {
    initializeONNX();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2"
      style={{ backgroundImage: `url("bg.png")`, backgroundSize: "cover" }}
    >
      <CanvasComponent
        width={width}
        height={height}
        outWidth={outWidth}
        outHeight={outHeight}
        canvasRef={canvasRef}
        outputCanvasRef={outputCanvasRef}
      />
      <br />
      {showDownloads && (
        <DownloadComponent
          canvasRef={canvasRef}
          outputCanvasRef={outputCanvasRef}
          url={url}
        />
      )}
      <HeroComponent loading={loading} loadingLink={loadingLink} />
      <div className="grid grid-cols-2 gap-3 py-2 px-4">
        <InputComponent
          canvasContext={canvasContext}
          setHeight={setHeight}
          setWidth={setWidth}
          setOutHeight={setOutHeight}
          setOutWidth={setOutWidth}
          url={url}
          setShowDownloads={setShowDownloads}
          setUrl={setUrl}
          setModel={setModel}
        />
        <RunComponent setImageInput={setImageInput} setShouldRun={setShouldRun} canvasContext={canvasContext}/>
      </div>
    </div>
  );
}
