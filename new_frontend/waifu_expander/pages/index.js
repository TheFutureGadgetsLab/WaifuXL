import sample from "../services/onnxExample";
import { useState, useEffect, createRef } from "react";
import ndarray from "ndarray";
import ops from "ndarray-ops";

function drawImage(canvasContext, imageSource, setHeight, setWidth) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageSource;
  img.onload = function () {
    setHeight(img.height);
    setWidth(img.width);
    canvasContext.drawImage(img, 0, 0);
  };
}

function drawOutput(canvasContext, data, setOutWidth, setOutHeight) {
  console.log(data);
  const height = data.dims[2];
  const width = data.dims[3];
  setOutWidth(width);
  setOutHeight(height);
  const inputArray = ndarray(data.data, data.dims);
  const dataTensor = ndarray(new Float32Array(width * height * 4).fill(255), [
    height,
    width,
    4,
  ]);
  ops.assign(dataTensor.pick(null, null, 0), inputArray.pick(0, 0, null, null));
  ops.assign(dataTensor.pick(null, null, 1), inputArray.pick(0, 1, null, null));
  ops.assign(dataTensor.pick(null, null, 2), inputArray.pick(0, 2, null, null));
  var idata = canvasContext.createImageData(width, height);
  // set our buffer as source
  idata.data.set(dataTensor.data);
  // update canvas with new data
  canvasContext.putImageData(idata, 0, 0);
}

export default function Home() {
  const [canvasContext, setCanvasContext] = useState(undefined);
  const [outputCanvasContext, setOutputCanvasContext] = useState(undefined);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [showDownloads, setShowDownloads] = useState(false);
  const [outHeight, setOutHeight] = useState(500);
  const [outWidth, setOutWidth] = useState(500);
  const [imageInput, setImageInput] = useState(undefined);
  const [url, setUrl] = useState("https://i.imgur.com/D0ZiNda.jpeg");

  const canvasRef = createRef();
  const outputCanvasRef = createRef();

  useEffect(async () => {
    setCanvasContext(canvasRef.current.getContext("2d"));
    setOutputCanvasContext(outputCanvasRef.current.getContext("2d"));
    const tmp = await sample(imageInput);
    if (tmp) {
      drawOutput(outputCanvasContext, tmp, setOutWidth, setOutHeight);
      setShowDownloads(true);
    } else {
      setShowDownloads(false);
    }
  }, [height, width, imageInput]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="grid grid-cols-2 gap-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ width: 500 }}
        />
        <canvas
          ref={outputCanvasRef}
          width={outWidth}
          height={outHeight}
          style={{ width: 500 }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {showDownloads && (
          <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Download Original
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
      <div className="grid grid-cols-3 gap-3">
        <input
          className="bg-gray-200 shadow-inner rounded-l p-2 flex-1"
          id="email"
          type="email"
          aria-label="email address"
          placeholder="https://i.imgur.com/D0ZiNda.jpeg"
          onBlur={(inp) => {
            setUrl(inp.target.value);
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            drawImage(canvasContext, url, setHeight, setWidth);
          }}
        >
          Display Image
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            const imageData = canvasContext.getImageData(
              0,
              0,
              canvasContext.canvas.width,
              canvasContext.canvas.height
            );
            const { data, width, height } = imageData;
            const dataTensor = ndarray(new Float32Array(data), [
              height,
              width,
              4,
            ]);
            const dataProcessedTensor = ndarray(
              new Float32Array(width * height * 3),
              [1, 3, height, width]
            );
            ops.assign(
              dataProcessedTensor.pick(0, 0, null, null),
              dataTensor.pick(null, null, 0)
            );
            ops.assign(
              dataProcessedTensor.pick(0, 1, null, null),
              dataTensor.pick(null, null, 1)
            );
            ops.assign(
              dataProcessedTensor.pick(0, 2, null, null),
              dataTensor.pick(null, null, 2)
            );
            setImageInput(dataProcessedTensor);
          }}
        >
          Upscale
        </button>
      </div>
    </div>
  );
}
