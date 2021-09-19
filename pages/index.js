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
  const [url, setUrl] = useState("https://i.imgur.com/v9Lwral.png");
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2" 
      style={{backgroundImage: `url("bg.png")`, backgroundSize: 'cover'}}>
      <div className="flex-grow grid grid-cols-2 justify-items-center w-full max-w-6xl">
        <canvas
          id="input"
          ref={canvasRef}
          width={width}
          height={height}
          style={{ width: 400 }}
        />
        <canvas
          id="output"
          ref={outputCanvasRef}
          width={outWidth}
          height={outHeight}
          style={{ width: 400 }}
        />
      </div>
      <br />
      <div className="flex-shrink grid grid-cols-2 justify-items-center px-10 text-center w-full max-w-6xl">
        {showDownloads && (
          <>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
              onClick={() => downloadImage("original", url, canvasRef)}
            >
              Download Original
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
              onClick={() => downloadImage("2x", url, outputCanvasRef)}
            >
              Download Upscaled
            </button>
          </>
        )}{" "}
      </div>
      <main className="flex flex-col items-center flex-shrink justify-center w-full p-10 text-center">
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
        >
          <option value="identity">Identity</option>
          <option value="superRes">Super Resolution</option>
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
          onClick={() => {
            setShowOutput(false);
            drawImage(canvasContext, url, setHeight, setWidth);
          }}
        >
          Display Image
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
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
