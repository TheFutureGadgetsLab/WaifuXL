function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function getPixelsFromInput(input) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = input;
    img.crossOrigin = "Anonymous";
    var results = null;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      resolve(context.getImageData(0, 0, img.width, img.height));
    };
  });
}

export function getDataURIFromInput(input) {
  return new Promise(async (resolve, reject) => {
    if (isValidHttpUrl(input)) {
      let blob = await fetch(input).then(r => r.blob());
      let dataUrl = await new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      resolve(dataUrl);
    } else {
      const img = new Image();
      img.src = input;
      img.crossOrigin = "Anonymous";
      var results = null;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        resolve(canvas.toDataURL());
      };
    }
  });
}

export function downloadImage(postFix, inputURI, downloadURI, fileName=null) {
  let link = document.createElement("a");
  let urlParts = inputURI.split(/[\.\/]/i);
  var imgName = fileName || urlParts[urlParts.length - 2];
  if (imgName.length > 20) {
    imgName = imgName.substring(0, 20);
  }
  link.download = `${imgName}_${postFix}.png`;
  link.href = downloadURI;
  link.click();
}

export function getDataURIFromFileUpload(uploaded, setDataURI) {
  const file = uploaded;
  const fr = new FileReader();
  fr.onload = function () {
    setDataURI(fr.result);
  };
  fr.readAsDataURL(file);
}
