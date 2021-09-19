export function downloadImage(postFix, url, ref) {
  var link = document.createElement("a");
  let urlParts = url.split(/[\.\/]/i);
  let imgName = urlParts[urlParts.length - 2];
  link.download = `${imgName}_${postFix}.png`;
  link.href = ref.current.toDataURL();
  link.click();
}

