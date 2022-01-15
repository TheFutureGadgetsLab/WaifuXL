import { parseGIF, decompressFrames } from "gifuct-js";
import { buildImageFromND, upScaleGifFrameFromURI } from "./processingUtilities";

async function frameAdd(frame, gif, setLoading) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.src = await upScaleGifFrameFromURI(
      frame.patch,
      setLoading,
      frame.dims.height,
      frame.dims.width
    );
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      gif.addFrame(img, { delay: frame.delay });
      resolve("Worked");
    };
  });
}
export default async function doGif(setLoading) {
  return new Promise(async (resolve, reject) => {
    var promisedGif = await fetch(
      "https://c.tenor.com/mkunLNebofwAAAAC/anime-headbang.gif"
    )
      .then((resp) => resp.arrayBuffer())
      .then((buff) => parseGIF(buff))
      .then((gif) => decompressFrames(gif, true));
    console.log(promisedGif);
    var GIF = require("./gif.js");
    var gif = new GIF({
      workers: 2,
      quality: 1,
      width: promisedGif[0].dims.width * 2,
      height: promisedGif[0].dims.height * 2,
    });

    for (var frame of promisedGif) {
      await frameAdd(frame, gif, setLoading);
    }
    var result = null;
    gif.on("finished", function (blob) {
      console.log("Finished!");
      console.log(blob);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function () {
        resolve(reader.result);
      };
    });

    await gif.render();
  });
}
