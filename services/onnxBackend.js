const ort = require('onnxruntime-web');

// Cached session state
var superSession = null;
var tagSession   = null;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function initializeONNX() {
    ort.env.wasm.numThreads = navigator.hardwareConcurrency / 2;
    ort.env.wasm.simd       = true;
    ort.env.wasm.proxy      = true;

    const superBuffer = await fetchMyModel('./superRes.onnx');
    const tagBuffer = await fetchMyModel('./tagger.onnx');

    superSession = await ort.InferenceSession.create(superBuffer, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: 'all',
        enableCpuMemArena: true,
        enableMemPattern: true,
        executionMode: 'parallel',
    });
    tagSession = await ort.InferenceSession.create(tagBuffer, {
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

    let timeStart = performance.now();
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
            break;
        } else {
            // Push values to the chunk array
            data.set(value, received);
            received += value.length;
        }
    }
    return data.buffer;
}
