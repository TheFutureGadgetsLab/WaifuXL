import ndarray from "ndarray";
import ops from "ndarray-ops";
import { getPixelsFromInput } from "./imageUtilities";
import { runSuperRes, runTagger } from "./onnxBackend";
import { doGif  } from "./gifUtilities";
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
  const rating = topK(flattened, 3, 4000, 2003).map((i) => [tags[i[0]], i[1]]);

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

export async function upScaleSingleURI(inputData, allowSplitting=true) {
  const dataArr = buildNdarrayFromImage(inputData);
  const imgH = dataArr.shape[2];
  const imgW = dataArr.shape[3];
  console.debug(dataArr.data.length, dataArr.shape);

  let superResOutput = null;
  if (allowSplitting) {
    const chunkSize = 900;
    const pad = 4;
    // Split the image in chunks and run super resolution on each chunk
    const combArr = ndarray(new Uint8Array(3 * (imgH * 2) * (imgW * 2)), [1, 3, imgH * 2, imgW * 2]);
    console.debug(combArr.shape);
    let chunkIdx = 0;
    console.debug(`splitting into ${Math.ceil(imgH / chunkSize) * Math.ceil(imgW / chunkSize)} chunks`);
    for (let i = 0; i < imgH; i += chunkSize) {
      for (let j = 0; j < imgW; j += chunkSize) {
        console.debug("processing chunk", chunkIdx, i, j);
        // Compute chunk bounds including padding
        const iStart = Math.max(0, i - pad);
        const inH = iStart + chunkSize + pad*2 > imgH ? imgH - iStart : chunkSize + pad*2;
        const outH = Math.min(imgH, i + chunkSize) - i;
        const jStart = Math.max(0, j - pad);
        const inW = jStart + chunkSize + pad*2 > imgW ? imgW - jStart : chunkSize + pad*2;
        const outW = Math.min(imgW, j + chunkSize) - j;
        console.debug(inH, inW);
        // Create sliced and copy
        const inSlice = dataArr.lo(0, 0, iStart, jStart).hi(1, 3, inH, inW);
        console.debug("inSlice:", inSlice.shape);
        const subArr = ndarray(new Uint8Array(inH * inW * 3), inSlice.shape);
        console.debug("subArr:", subArr.shape);
        ops.assign(subArr, inSlice);
        // Run the super resolution model on the chunk, copy the result into the combined array
        const chunkData = await runSuperRes(subArr);
        const chunkArr = ndarray(chunkData.data, chunkData.dims);
        console.debug("chunkArr:", chunkArr.shape);
        console.debug(`finished chunk (${iStart}, ${jStart}) [${inH}, ${inW}]`);
        const chunkSlice = chunkArr
          .lo(0, 0, (i - iStart)*2, (j - jStart)*2)
          .hi(1, 3, outH * 2, outW * 2);
        console.debug("chunkSlice:", chunkSlice.shape);
        const outSlice = combArr
          .lo(0, 0, i*2, j*2)
          .hi(1, 3, outH * 2, outW * 2);
        console.debug("outSlice:", outSlice.shape);
        ops.assign(outSlice, chunkSlice);
        chunkIdx++;
      }
    }
    superResOutput = combArr;
  } else {
    superResOutput = await runSuperRes(dataArr, setLoading);
  }

  // Reshape network output into a normal image
  const outNDArr = buildNdarrayFromImageOutput(superResOutput, imgH * 2, imgW * 2)
  const outURI = buildImageFromND(outNDArr, imgH * 2, imgW * 2);
  return outURI;
}

export async function upScaleFromURI(uri, setLoading, setTags, setUpscaleProgress, setExtension) {
  if (uri.slice(0, 14) == "data:image/gif") {
    setExtension("gif")
    //is gif
    const results = await doGif(uri, setLoading, setTags, setUpscaleProgress);
    setLoading(false);
    return results;
  } else {
    //is image
    const inputData = await getPixelsFromInput(uri);

    const tagInput = buildNdarrayFromImage(inputData);
    const tagOutput = await runTagger(tagInput);
    const tags = await getTopTags(tagOutput);
    setTags(tags);

    setLoading(true);
    console.debug("starting upscaling");
    const outURI = upScaleSingleURI(inputData);
    setLoading(false);
    return outURI;
  }
}

export async function upScaleGifFrameFromURI(
  frameData,
  setLoading,
  height,
  width
) {
  return new Promise(async (resolve, reject) => {
    const inputData = await getPixelsFromInput(
      buildImageFromND(frameData, height, width)
    );
    const superResInput = buildNdarrayFromImage(inputData);
    const superResOutput = await runSuperRes(superResInput, setLoading);
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

