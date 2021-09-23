import { useState, useEffect, createRef } from "react";
import { drawImage } from "../services/imageUtilities";
import { initializeONNX, runModel } from "../services/onnxBackend";
import { clearCanvas  } from "../services/canvasUtilities";
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
  const [url, setUrl] = useState("https://i.imgur.com/Sf6sfPj.png");
  const [drawnURL, setDrawnURL] = useState("");
  const [model, setModel] = useState("identity");
  const loadingLink = "https://i.4pcdn.org/pol/1552671673728.gif";
  const canvasRef = createRef();
  const outputCanvasRef = createRef();

  useEffect(async () => {
    //when canvases are available, and we've got a fresh url to draw
    if (canvasContext && outputCanvasContext && drawnURL !== url) {
      //draw the url
      drawImage(
        canvasContext,
        url,
        setHeight,
        setWidth,
        setOutHeight,
        setOutWidth
      );
      //clear the canvas
      clearCanvas(outputCanvasContext, outWidth, outHeight)
      //store this url as the currently drawn url
      setDrawnURL(url);
      //make sure downloads are not shown
      setShowDownloads(false);
    }
  }, [height, width, canvasContext, url]);

  useEffect(async () => {
    initializeONNX();
    setCanvasContext(canvasRef.current.getContext("2d"));
    setOutputCanvasContext(outputCanvasRef.current.getContext("2d"));
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
        <RunComponent
          canvasContext={canvasContext}
          outputCanvasContext={outputCanvasContext}
          setShowDownloads={setShowDownloads}
          setLoading={setLoading}
          model={model}
          setOutHeight={setOutHeight}
          setOutWidth={setOutWidth}
        />
      </div>
    </div>
  );
}
