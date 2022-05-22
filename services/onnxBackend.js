const ort = require('onnxruntime-web');
const usr = require('ua-parser-js');
// Cached session state
var superSession = null;
var tagSession   = null;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function initializeONNX() {
    ort.env.wasm.simd       = true;
    ort.env.wasm.proxy      = true;

    if (typeof fetch !== 'undefined') {
        const superModel = await fetchMyModel('./models/superRes.onnx');
        const tagModel = await fetchMyModel('./models/tagger.onnx');

        const ua = usr(navigator.userAgent);
        if (ua.engine.name == "WebKit") {
            ort.env.wasm.numThreads = 1
        } else {
            ort.env.wasm.numThreads = min(navigator.hardwareConcurrency / 2, 16);
        }
        superSession = await ort.InferenceSession.create(superModel, {
            executionProviders: ["wasm"],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
            enableMemPattern: true,
            executionMode: 'parallel',
        });
        tagSession = await ort.InferenceSession.create(tagModel, {
            executionProviders: ["wasm"],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
            enableMemPattern: true,
            executionMode: 'parallel',
        });
    
    
        // Needed because WASM workers are created async, wait for them
        // to be ready
        await sleep(300);
    
    }
    else {
        console.log("No fetch")
    }
    
}

function prepareImage(imageArray) {
    const height = imageArray.shape[2];
    const width = imageArray.shape[3];
    const tensor = new ort.Tensor('uint8', imageArray.data, [1,3,height,width]);
    return { input: tensor };
}

export async function runSuperRes(imageArray) {
    const feeds = prepareImage(imageArray);

    let session = null;
    session = superSession;

    let results = undefined;
    try {
        const output = await session.run(feeds);
        results = output.output;
    } catch (e) {
        console.log("Failed to run super resolution");
        console.log(e);
    }    
    return results;
}

export async function runTagger(imageArray) {
    const feeds = prepareImage(imageArray);

    let session = null;
    session = tagSession;

    let results = undefined;
    try {
        const output = await session.run(feeds);
        results = output.output;
    } catch (e) {
        console.error("Failed to run tagger");
        console.log(e)
    }
    return results;
}

async function fetchMyModel(filepathOrUri) {
    const response = await fetch(filepathOrUri);
    return await response.arrayBuffer();
}
