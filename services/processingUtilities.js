import ndarray from "ndarray";
import ops from "ndarray-ops";
import { getPixelsFromInput } from "./imageUtilities";
import { runModel } from "./onnxBackend";

export function buildNdarrayFromModelOutput(data, height, width) {
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

export async function  upScaleFromURI(uri, setLoading) {
  const inputData = await getPixelsFromInput(uri);
  const inputND = buildNdarrayFromImage(inputData);
  const results = await runModel(inputND, setLoading);
  const outputND = buildNdarrayFromModelOutput(results, results.dims[2], results.dims[3])
  const outputImage = buildImageFromND(outputND, results.dims[2], results.dims[3]);
  return outputImage;
}