const ort = require("onnxruntime-web");
const usr = require("ua-parser-js");

// Cached session state
var superSession = null;
var tagSession = null;

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetchMyModel(filepathOrUri, setProgress, startProgress, endProgress) {
  console.assert(typeof fetch !== "undefined");
  const response = await fetch(filepathOrUri);
  const reader = response.body.getReader();
  const length = parseInt(response.headers.get("content-length"));
  let data = new Uint8Array(length);
  let received = 0;

  // Loop through the response stream and extract data chunks
  while (true) {
      const { done, value } = await reader.read();

      if (done) {
          setProgress(1);
          break;
      } else {
          // Push values to the chunk array
          data.set(value, received);
          received += value.length;
          setProgress(startProgress + (received / length) * (endProgress - startProgress));
      }
  }
  return data.buffer;
}

async function downloadModel(setProgress) {
  setProgress(0);
  const superResBuf = await fetchMyModel('./models/superRes.onnx', setProgress, 0.0, 0.5);
  const taggerBuf = await fetchMyModel('./models/tagger.onnx', setProgress, 0.5, 0.9);
  superSession = await ort.InferenceSession.create(superResBuf, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: "sequential", // Inter-op sequential
  });
  tagSession = await ort.InferenceSession.create(taggerBuf, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
    enableCpuMemArena: true,
    enableMemPattern: true,
    executionMode: "sequential", // Inter-op sequential
  });
  setProgress(1);
}

export async function initializeONNX(setProgress) {
  ort.env.wasm.simd = true;
  ort.env.wasm.proxy = true;

  const ua = usr(navigator.userAgent);
  if (ua.engine.name == "WebKit") {
    ort.env.wasm.numThreads = 1;
  } else {
    ort.env.wasm.numThreads = Math.min(navigator.hardwareConcurrency / 2, 16);
  }
  await downloadModel(setProgress);

  // Needed because WASM workers are created async, wait for them
  // to be ready
  await sleep(300);
}

function prepareImage(imageArray) {
  const height = imageArray.shape[2];
  const width = imageArray.shape[3];
  const tensor = new ort.Tensor("uint8", imageArray.data, [
    1,
    3,
    height,
    width,
  ]);
  return { input: tensor };
}

export async function runSuperRes(imageArray) {
  const feeds = prepareImage(imageArray);

  let session = null;
  session = superSession;
  let results = undefined;
  if (session) {
    try {
      const output = await session.run(feeds);
      results = output.output;
    } catch (e) {
      console.log("Failed to run super resolution");
      console.log(e);
    }
  }
  return results;
}

export async function runTagger(imageArray) {
  const feeds = prepareImage(imageArray);

  let session = null;
  session = tagSession;
  let results = undefined;
  if (session) {
    try {
      const output = await session.run(feeds);
      results = output.output;
    } catch (e) {
      console.error("Failed to run tagger");
      console.log(e);
    }
  }
  return results;
}
