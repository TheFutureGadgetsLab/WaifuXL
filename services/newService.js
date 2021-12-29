import ndarray from "ndarray";
import ops from "ndarray-ops";
import { runModel } from "./onnxBackend";
import { buildNdarrayFromModelOutput } from "./processingUtilities";

export function getPixelsFromInput(input) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.crossOrigin = "Anonymous";
      var results = null;
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        resolve(context.getImageData(0, 0, img.width, img.height));
      }
    })
}

export function getDataURIFromInput(input) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = input;
      img.crossOrigin = "Anonymous";
      var results = null;
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        resolve(canvas.toDataURL());
      }
    })
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

export function downloadImage(postFix, inputURI, downloadURI) {
    var link = document.createElement("a");
    let urlParts = inputURI.split(/[\.\/]/i);
    let imgName = urlParts[urlParts.length - 2];
    link.download = `${imgName}_${postFix}.png`;
    link.href = downloadURI;
    link.click();
}