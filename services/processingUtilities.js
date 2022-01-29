import ndarray from "ndarray";
import ops from "ndarray-ops";
import { getPixelsFromInput } from "./imageUtilities";
import { getTagTime, runSuperRes, runTagger } from "./onnxBackend";
import { doGif  } from "./gifUtilities";

// Global variables for progress estimation
var imageNpixels = 0;
var imgProgressStopAt = 1.0;
export function setImgProgressStopAt(v) {
  imgProgressStopAt = Math.max(0, Math.min(1, v));
}

export function buildNdarrayFromImageOutput(data, height, width) {
    const inputArray = ndarray(data.data, data.dims || data.shape);
    const dataTensor = ndarray(new Uint8Array(width * height * 4).fill(255), [
      height,
      width,
      4,
    ]);
    ops.assign(dataTensor.pick(null, null, 0), inputArray.pick(0, 0, null, null));
    ops.assign(dataTensor.pick(null, null, 1), inputArray.pick(0, 1, null, null));
    ops.assign(dataTensor.pick(null, null, 2), inputArray.pick(0, 2, null, null));
    return dataTensor.data;
}

export async function loadTags() {
  const tags = await fetch("./tags.json");
  const tagsJson = await tags.json();
  const tagsArray = tagsJson.map((tag) => tag[1]);
  return tagsArray;
}

// find indices of top k values in ndarray
export function topK(ndarray, k, startIndex, stopIndex) {
  const values = ndarray.data.slice(startIndex, stopIndex);
  const indices = [...Array(values.length).keys()];
  indices.sort((a, b) => values[b] - values[a]);

  // zip indices and values into an array of tuples
  const tuples = indices.map((i) => [i + startIndex, values[i]]);
  return tuples.slice(0, k);
}

export async function getTopTags(data) {
  const tags = await loadTags();
  const flattened = ndarray(data.data, data.dims);

  const topDesc = topK(flattened, 2000, 0, 2000).map((i) => [tags[i[0]], i[1]]);
  const topChars = topK(flattened, 2000, 2000, 4000).map((i) => [
    tags[i[0]],
    i[1],
  ]);
  const rating = topK(flattened, 3, 4000, 4003).map((i) => [tags[i[0]], i[1]]);

  return { topDesc, topChars, rating };
}

export function buildNdarrayFromImage(imageData) {
  const { data, width, height } = imageData;
  const dataTensor = ndarray(new Uint8Array(data), [height, width, 4]);
  const dataProcessedTensor = ndarray(new Uint8Array(width * height * 3), [
    1,
    3,
    height,
    width,
  ]);
  imageNpixels = width * height;
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
  return dataProcessedTensor;
}

export function buildImageFromND(nd, height, width) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  var data = context.createImageData(width, height);
  data.data.set(nd);
  context.putImageData(data, 0, 0);
  return canvas.toDataURL();
}

export async function upScaleSingleURI(inputData, setUpscaleProgress) {
  const inArr = buildNdarrayFromImage(inputData);
  const imgH = inArr.shape[2];
  const imgW = inArr.shape[3];

  const chunkSize = 512;
  const pad = 4;
  // Split the image in chunks and run super resolution on each chunk
  const outArr = ndarray(new Uint8Array(3 * (imgH * 2) * (imgW * 2)), [1, 3, imgH * 2, imgW * 2]);
  let chunkIdx = 0;
  let nChunks = Math.ceil(imgH / chunkSize) * Math.ceil(imgW / chunkSize);
  for (let i = 0; i < imgH; i += chunkSize) {
    for (let j = 0; j < imgW; j += chunkSize) {
      setImgProgressStopAt((chunkIdx + 1) / nChunks);
      // Compute chunk bounds including padding
      const iStart = Math.max(0, i - pad);
      const inH = iStart + chunkSize + pad*2 > imgH ? imgH - iStart : chunkSize + pad*2;
      const outH = Math.min(imgH, i + chunkSize) - i;
      const jStart = Math.max(0, j - pad);
      const inW = jStart + chunkSize + pad*2 > imgW ? imgW - jStart : chunkSize + pad*2;
      const outW = Math.min(imgW, j + chunkSize) - j;
      imageNpixels = inH * inW;
      // Create sliced and copy
      const inSlice = inArr.lo(0, 0, iStart, jStart).hi(1, 3, inH, inW);
      const subArr = ndarray(new Uint8Array(inH * inW * 3), inSlice.shape);
      ops.assign(subArr, inSlice);
      // Run the super resolution model on the chunk, copy the result into the combined array
      const chunkData = await runSuperRes(subArr);
      const chunkArr = ndarray(chunkData.data, chunkData.dims);
      const chunkSlice = chunkArr
        .lo(0, 0, (i - iStart)*2, (j - jStart)*2)
        .hi(1, 3, outH * 2, outW * 2);
      const outSlice = outArr
        .lo(0, 0, i*2, j*2)
        .hi(1, 3, outH * 2, outW * 2);
      ops.assign(outSlice, chunkSlice);
      setUpscaleProgress((chunkIdx + 1) / nChunks);
      chunkIdx++;
    }
  }

  // Reshape network output into a normal image
  const outImg = buildNdarrayFromImageOutput(outArr, imgH * 2, imgW * 2)
  const outURI = buildImageFromND(outImg, imgH * 2, imgW * 2);
  return outURI;
}

export async function upScaleFromURI(uri, setLoading, setTags, setUpscaleProgress, setExtension) {
  setLoading(true);
  let resultURI = null;
  if (uri.slice(0, 14) == "data:image/gif") {
    setExtension("gif")
    //is gif
    resultURI = await doGif(uri, setTags, setUpscaleProgress);
  } else {
    //is image
    setExtension("png")
    const inputData = await getPixelsFromInput(uri);

    const tagInput = buildNdarrayFromImage(inputData);
    const tagOutput = await runTagger(tagInput);
    const tags = await getTopTags(tagOutput);
    setTags(tags);

    console.debug("starting upscaling");
    resultURI = await upScaleSingleURI(inputData, setUpscaleProgress);
  }
  setLoading(false);
  return resultURI;
}

export async function upScaleGifFrameFromURI(
  frameData,
  height,
  width
) {
  return new Promise(async (resolve, reject) => {
    const inputData = await getPixelsFromInput(
      buildImageFromND(frameData, height, width)
    );
    const superResInput = buildNdarrayFromImage(inputData);
    const superResOutput = await runSuperRes(superResInput);
    const outputND = buildNdarrayFromImageOutput(
      superResOutput,
      superResOutput.dims[2],
      superResOutput.dims[3]
    );
    const outputImage = buildImageFromND(
      outputND,
      superResOutput.dims[2],
      superResOutput.dims[3]
    );
    resolve(outputImage);
  });
}

// Progress estimation
const baseTagTime = 40 / 1000;
export const upscaleEstFreq = 0.3;
const baseEstSecPerPixel = 0.000055;
export function upscaleIncrementProgress(upscaleProgress, setUpscaleProgress)
{
  if (imageNpixels > 0) {
    let speedFactor = baseTagTime / getTagTime();
    if (typeof SharedArrayBuffer === "undefined") {
      speedFactor *= 3;
    }
    let totalTimeEst = baseEstSecPerPixel * speedFactor * imageNpixels;
    let progressToStop = Math.min(1, upscaleProgress / imgProgressStopAt);
    let slowdownFactor = Math.max(0, 1 - Math.pow(progressToStop + 0.03, 8));
    let estProgress = upscaleProgress + (upscaleEstFreq / totalTimeEst) * slowdownFactor;
    setUpscaleProgress(Math.min(imgProgressStopAt, estProgress));
  }
}