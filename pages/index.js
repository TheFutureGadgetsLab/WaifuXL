import runModel from "../services/onnxBackend";
import { useState, useEffect, createRef } from "react";
import {
  downloadImage,
  drawImage,
  drawOutput,
} from "../services/imageUtilities";
import { buildNdarrayFromImage } from "../services/processingUtilities";

export default function Home() {
  const [canvasContext, setCanvasContext] = useState(undefined);
  const [outputCanvasContext, setOutputCanvasContext] = useState(undefined);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [outHeight, setOutHeight] = useState(500);
  const [outWidth, setOutWidth] = useState(500);
  const [showDownloads, setShowDownloads] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [imageInput, setImageInput] = useState(undefined);
  const [url, setUrl] = useState("https://i.imgur.com/OOFc0Af.png");
  const [model, setModel] = useState("identity");

  const canvasRef = createRef();
  const outputCanvasRef = createRef();

  useEffect(async () => {
    setCanvasContext(canvasRef.current.getContext("2d"));
    setOutputCanvasContext(outputCanvasRef.current.getContext("2d"));
    const tmp = await runModel(imageInput, model);
    if (tmp) {
      drawOutput(outputCanvasContext, tmp, setOutWidth, setOutHeight);
      setShowDownloads(true);
      setShowOutput(true);
    } else {
      setShowDownloads(false);
    }
  }, [height, width, imageInput]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="grid grid-cols-2 gap-4">
        <canvas
          id="input"
          ref={canvasRef}
          width={width}
          height={height}
          style={{ width: 500 }}
        />
        <canvas
          id="output"
          ref={outputCanvasRef}
          width={outWidth}
          height={outHeight}
          style={{ width: 500 }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {showDownloads && (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => downloadImage("original", url, canvasRef)}
            >
              Download Original
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => downloadImage("2x", url, outputCanvasRef)}
            >
              Download Upscaled
            </button>
          </>
        )}{" "}
      </div>
      <br />
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <br />
        <h1 className="text-6xl font-bold">
          Expand your <span className="text-blue-600">{"waifu"}</span>
        </h1>
      </main>
      <div className="grid grid-cols-4 gap-3">
        <input
          className="bg-gray-200 shadow-inner rounded-l p-2 flex-1"
          id="image-url"
          placeholder={url}
          onBlur={(inp) => {
            setUrl(inp.target.value);
          }}
        />
        <select name="selectList" id="selectList" onChange={(inp) => {setModel(inp.target.value);}}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <option value="identity">Identity</option>
          <option value="superRes">Super Resolution</option>
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setShowOutput(false);
            drawImage(canvasContext, url, setHeight, setWidth);
          }}
        >
          Display Image
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setImageInput(buildNdarrayFromImage(canvasContext));
          }}
        >
          Upscale
        </button>
      </div>
    </div>
  );
}
