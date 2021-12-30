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

export function downloadImage(postFix, inputURI, downloadURI) {
  var link = document.createElement("a");
  let urlParts = inputURI.split(/[\.\/]/i);
  let imgName = urlParts[urlParts.length - 2];
  link.download = `${imgName}_${postFix}.png`;
  link.href = downloadURI;
  link.click();
}

export function getDataURIFromFileUpload(uploaded, setDataURI) {
  const file = uploaded;
  const fr = new FileReader();
  fr.onload = function() {
      setDataURI(fr.result);
  }
  fr.readAsDataURL(file);
}