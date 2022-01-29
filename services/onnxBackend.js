const ort = require('onnxruntime-web');

// Cached session state
var superSession = null;
var tagSession   = null;

// Processing speed estimate
var tagTime = 0;
export function getTagTime() {
    return tagTime;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function initializeONNX(setProgress) {
    ort.env.wasm.numThreads = navigator.hardwareConcurrency / 2;
    ort.env.wasm.simd       = true;
    ort.env.wasm.proxy      = true;

    setProgress(0);
    const superBuffer = await fetchMyModel('./superRes.onnx', setProgress, 0.0, 0.5);
    const tagBuffer = await fetchMyModel('./tagger.onnx', setProgress, 0.5, 0.9);

    console.log("Initializing session");
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

    setProgress(1);

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

    console.log("Running super resolution");
    console.time('run_super_res');
    let results = undefined;
    try {
        const output = await session.run(feeds);
        results = output.output;
    } catch (e) {
        console.log("Failed to run super resolution");
        console.log(e)
    }    
    console.timeEnd('run_super_res');
    console.log("Super resolution done");
    return results;
}

export async function runTagger(imageArray) {
    const feeds = prepareImage(imageArray);

    let session = null;
    session = tagSession;

    console.log("Running tagger session");
    console.time('run_tagger')
    let timeStart = performance.now();
    let results = undefined;
    try {
        const output = await session.run(feeds);
        results = output.output;
    } catch (e) {
        console.error("Failed to run tagger");
        console.log(e)
    }
    tagTime = (performance.now() - timeStart) / 1000.0;
    console.timeEnd('run_tagger')
    console.log("Tagging done");
    return results;
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
