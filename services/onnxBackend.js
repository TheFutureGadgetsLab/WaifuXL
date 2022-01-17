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

    // Needed because WASM workers are created async, wait for them
    // to be ready
    await sleep(1000);
}

function prepareImage(imageArray) {
    const height = imageArray.shape[2];
    const width = imageArray.shape[3];
    const tensor = new ort.Tensor('uint8', imageArray.data, [1,3,height,width]);
    return { input: tensor };
}

export async function runSuperRes(imageArray, setLoading) {
    if (setLoading) setLoading(true);

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
        if (setLoading) setLoading(false);
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
    let results = undefined;
    try {
        const output = await session.run(feeds);
        results = output.output;
    } catch (e) {
        console.error("Failed to run tagger");
        console.log(e)
    }    
    console.timeEnd('run_tagger')
    console.log("Tagging done");
    return results;
}

async function fetchMyModel(filepathOrUri) {
    // use fetch to read model file (browser) as ArrayBuffer
    if (typeof fetch !== 'undefined') {
        const response = await fetch(filepathOrUri);
        return await response.arrayBuffer();
    }
}
