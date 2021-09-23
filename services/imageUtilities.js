import { buildNdarrayFromModelOutput } from "./processingUtilities";

export function downloadImage(postFix, url, ref) {
  var link = document.createElement("a");
  let urlParts = url.split(/[\.\/]/i);
  let imgName = urlParts[urlParts.length - 2];
  link.download = `${imgName}_${postFix}.png`;
  link.href = ref.current.toDataURL();
  link.click();
}

export function drawImage(
  canvasContext,
  imageSource,
  setHeight,
  setWidth,
) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageSource;
  img.onload = function () {
    setHeight({input: img.height, output: img.height});
    setWidth({input: img.width, output: img.width});
    canvasContext.drawImage(img, 0, 0);
  };
}

export function drawOutput(canvasContext, data, setHeight, setWidth, height, width) {
  const imageHeight = data.dims[2];
  const imageWidth = data.dims[3];
  setHeight({...height, output: imageHeight})
  setWidth({...width, output: imageWidth});
  var idata = canvasContext.createImageData(imageWidth, imageHeight);
  idata.data.set(buildNdarrayFromModelOutput(data, imageHeight, imageWidth));
  canvasContext.putImageData(idata, 0, 0);
}

export function clearOutput(canvasContext) {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
}

export function getImageFromFileUpload(
  uploaded,
  canvasContexts,
  setHeight,
  setWidth,
) {
  const file = uploaded;
  const fr = new FileReader();
  fr.onload = function () {
    drawImage(
      canvasContexts.input,
      fr.result,
      setHeight,
      setWidth,
    );

  };
  fr.readAsDataURL(file);
}
