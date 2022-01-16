import { parseGIF, decompressFrames } from "gifuct-js";
import {
  buildImageFromND,
  upScaleGifFrameFromURI,
  buildNdarrayFromImage,
  getTopTags,
} from "./processingUtilities";
import { getPixelsFromInput } from "./imageUtilities";
import { runTagger } from "./onnxBackend";

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
export async function doGif(inputURI, setLoading, setTags, setUpscaleProgress) {
  return new Promise(async (resolve, reject) => {
    const extractFrames = require("./gifExtract.js");
    const results = await extractFrames({
      input: "https://c.tenor.com/mkunLNebofwAAAAC/anime-headbang.gif",
    });
    console.log(results);
    var promisedGif = await fetch(inputURI)
      .then((resp) => resp.arrayBuffer())
      .then((buff) => parseGIF(buff))
      .then((gif) => decompressFrames(gif, true));
    var GIF = require("./gif.js");
    var gif = new GIF({
      workers: 2,
      quality: 1,
      width: promisedGif[0].dims.width * 2,
      height: promisedGif[0].dims.height * 2,
    });

    const inputData = await getPixelsFromInput(
      buildImageFromND(
        promisedGif[0].patch,
        promisedGif[0].dims.height,
        promisedGif[0].dims.width
      )
    );
    const tagInput = buildNdarrayFromImage(inputData);
    const tagOutput = await runTagger(tagInput);
    const tags = await getTopTags(tagOutput);
    setTags(tags);
    var i = 0;
    setUpscaleProgress([0, promisedGif.length]);
    for (var frame of promisedGif) {
      setUpscaleProgress([i, promisedGif.length]);
      await frameAdd(frame, gif, setLoading);
      i++;
    }
    gif.on("finished", function (blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function () {
        resolve(reader.result);
      };
    });

    await gif.render();
  });
}
