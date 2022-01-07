const ort = require('onnxruntime-web');

// Cached session state
var superSession = null;
var tagSession   = null;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function initializeONNX() {
    ort.env.wasm.numThreads = navigator.hardwareConcurrency;
    ort.env.wasm.simd       = true;
    ort.env.wasm.proxy      = true;

    console.log("Initializing session");
    superSession = await ort.InferenceSession.create("./superRes.onnx", ['wasm']);
    tagSession = await ort.InferenceSession.create("./tagger.onnx", ['wasm']);

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
    setLoading(true);

    const feeds = prepareImage(imageArray);

    let session = null;
    session = superSession;

    console.log("Running super resolution");
    console.time('run_super_res');
    let results = undefined;
    try {
        const output = await session.run(feeds);
        results = output.output;
        setLoading(false);
    } catch (e) {
        setLoading(false);
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
        console.log("Failed to run tagger");
        console.log(e)
    }    
    console.timeEnd('run_tagger')
    console.log("Tagging done");
    return results;
}