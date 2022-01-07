import ndarray from "ndarray";
import ops from "ndarray-ops";
import { getPixelsFromInput } from "./imageUtilities";
import { runSuperRes, runTagger } from "./onnxBackend";

export function buildNdarrayFromImageOutput(data, height, width) {
    const inputArray = ndarray(data.data, data.dims);
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
    const tags = await fetch("/tags.json");
    const tagsJson = await tags.json();
    const tagsArray = tagsJson.map((tag) => tag[1]);
    return tagsArray;
}

// find indices of top k values in ndarray
export function topK(ndarray, k, startIndex, stopIndex) {
    const values = ndarray.data.slice(startIndex, stopIndex);
    const indices = new Array(values.length);
    for (let i = 0; i < values.length; i++) {
        indices[i] = [i + startIndex, values[i]];
    }
    indices.sort((a, b) => b[1] - a[1]);
    console.log(indices);
    return indices.slice(0, k);
}

export async function getTopTags(data) {
    const tags = await loadTags();
    const flattened = ndarray(data.data, data.dims);

    const topDesc  = topK(flattened, 10, 0, 1000).map((i) => [tags[i[0]], i[1]]);
    const topChars = topK(flattened, 10, 1000, 2000).map((i) => [tags[i[0]], i[1]]);
    const rating   = topK(flattened, 3, 2000, 2003).map((i) => [tags[i[0]], i[1]]);

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
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  var data = context.createImageData(width, height);
  data.data.set(nd);
  context.putImageData(data, 0, 0);
  return canvas.toDataURL();
}

export async function  upScaleFromURI(uri, setLoading, setTags) {
  const inputData = await getPixelsFromInput(uri);
  
  const tagInput  = buildNdarrayFromImage(inputData);
  const tagOutput = await runTagger(tagInput);
  const tags = await getTopTags(tagOutput);
  setTags(tags);
  
  const superResInput = buildNdarrayFromImage(inputData);
  const superResOutput = await runSuperRes(superResInput, setLoading);

  const outputND = buildNdarrayFromImageOutput(superResOutput, superResOutput.dims[2], superResOutput.dims[3])
  const outputImage = buildImageFromND(outputND, superResOutput.dims[2], superResOutput.dims[3]);
  return outputImage;
}