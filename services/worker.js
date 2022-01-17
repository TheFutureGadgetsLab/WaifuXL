import { upScaleFromNDArray } from "./processingUtilities";

onmessage = function(e) {
  let data = e.data[0];
  console.debug("received data");
  const result = await upScaleFromNDArray(data.ndarray);
  // If the models output is valid
  console.assert(result);
  if (result) {
    postMessage(result);
  }
}

console.debug("worker init");