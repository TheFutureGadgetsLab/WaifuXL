import { buildNdarrayFromModelOutput } from "./processingUtilities";

export function downloadImage(postFix, url, ref) {
  var link = document.createElement("a");
  let urlParts = url.split(/[\.\/]/i);
  let imgName = urlParts[urlParts.length - 2];
  link.download = `${imgName}_${postFix}.png`;
  link.href = ref.current.toDataURL();
  link.click();
}

export function drawImage(canvasContext, imageSource, setHeight, setWidth, setOutHeight, setOutWidth) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageSource;
  img.onload = function () {
    setHeight(img.height);
    setWidth(img.width);
    setOutHeight(img.height);
    setOutWidth(img.width);
    console.log(img.height);
    console.log(img.width);
    canvasContext.drawImage(img, 0, 0);
  };
}

export function drawOutput(canvasContext, data, setOutHeight, setOutWidth) {
  const height = data.dims[2];
  const width = data.dims[3];
  setOutHeight(height);
  setOutWidth(width);
  var idata = canvasContext.createImageData(width, height);
  idata.data.set(buildNdarrayFromModelOutput(data, height, width));
  canvasContext.putImageData(idata, 0, 0);
}
