import { useState, useEffect, createRef } from "react";
import { drawImage } from "../services/imageUtilities";
import { initializeONNX } from "../services/onnxBackend";
import { clearCanvas } from "../services/canvasUtilities";
import { PINK } from "../constants/colors";
import CanvasComponent from "../components/CanvasComponent";
import DownloadComponent from "../components/DownloadComponent";
import TitleComponent from "../components/TitleComponent";
import InputComponent from "../components/InputComponent";
import RunComponent from "../components/RunComponent";
import Router from "next/router";
export default function Home() {
  const loadingLink =
    "https://thumbs.gfycat.com/ThunderousScratchyArthropods.webp";
  const canvasRef = createRef();
  const outputCanvasRef = createRef();
  const [canvasContexts, setCanvasContexts] = useState({
    input: undefined,
    output: undefined,
  });
  const [height, setHeight] = useState({ input: 500, output: 500 });
  const [width, setWidth] = useState({ input: 500, output: 500 });
  const [loading, setLoading] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [url, setUrl] = useState("https://i.imgur.com/Sf6sfPj.png");
  const [drawnURL, setDrawnURL] = useState("");
  const [open, setOpen] = useState(false);

  //when height, width, canvasContext, or url change
  useEffect(async () => {
    //when canvases are available, and we've got a fresh url to draw
    if (canvasContexts.input && canvasContexts.output && drawnURL !== url) {
      //draw the url
      drawImage(canvasContexts.input, url, setHeight, setWidth);
      //clear the canvas
      clearCanvas(canvasContexts.output, width.out, height.out);
      //store this url as the currently drawn url
      setDrawnURL(url);
      //make sure downloads are not shown
      setShowDownloads(false);
    }
  }, [canvasContexts, url]);

  //at startup
  useEffect(async () => {
    initializeONNX();
    setCanvasContexts({
      input: canvasRef.current.getContext("2d"),
      output: outputCanvasRef.current.getContext("2d"),
    });
  }, []);

  return (
    <>
      <div
        className="flex flex-col items-center min-h-screen"
        style={{ backgroundImage: `url("bg.png")`, backgroundSize: "cover" }}
      >
        <div class="fixed">
          <header>
            <nav class="">
              <div class="container mx-auto py-4 flex justify-between items-center">
                <h1 class="text-2xl font-bold text-black" style={{ color: PINK }}>WaifuXL</h1>
                <div class="flex px-10 space-x-10">
                  <div class="flex items-center space-x-2" onClick={() => Router.push("/about")}>
                    <span class="text-black">About</span>
                  </div>
                  <div class="flex items-center space-x-2" onClick={() => Router.push("/donate")}>
                    <span class="text-black">Donate</span>
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </div>
        <br />
        <br />
        <br />

        <CanvasComponent
          width={width}
          height={height}
          canvasRef={canvasRef}
          outputCanvasRef={outputCanvasRef}
          loadingImgSrc={loadingLink}
          loading={loading}
        />
        {showDownloads && (
          <DownloadComponent
            canvasRef={canvasRef}
            outputCanvasRef={outputCanvasRef}
            url={url}
          />
        )}
        <TitleComponent loading={loading} />
        <div className="grid grid-cols-2 gap-3 py-2 px-4">
          <InputComponent
            open={open}
            setOpen={setOpen}
            canvasContexts={canvasContexts}
            setHeight={setHeight}
            setWidth={setWidth}
            url={url}
            setShowDownloads={setShowDownloads}
            setUrl={setUrl}
          />
          <RunComponent
            canvasContext={canvasContexts.input}
            outputCanvasContext={canvasContexts.output}
            setShowDownloads={setShowDownloads}
            setLoading={setLoading}
            setHeight={setHeight}
            setWidth={setWidth}
            height={height}
            width={width}
          />
        </div>
      </div>
    </>
  );
}
