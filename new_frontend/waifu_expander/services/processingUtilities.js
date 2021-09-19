import ndarray from "ndarray";
import ops from "ndarray-ops";


export function buildNdarrayFromImage(canvasContext) {
  const imageData = canvasContext.getImageData(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
  );
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
