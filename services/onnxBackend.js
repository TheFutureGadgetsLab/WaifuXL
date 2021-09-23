const ort = require('onnxruntime-web');

// Cached session state
var superSession = null;
var identSession = null;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function initializeONNX() {
    ort.env.wasm.numThreads = navigator.hardwareConcurrency / 2;
    ort.env.wasm.simd       = true;
    ort.env.wasm.proxy      = true;

    console.log("(Re)initializing session");
    superSession = await ort.InferenceSession.create("./superRes.onnx", ['wasm']);
    identSession = await ort.InferenceSession.create("./identity.onnx", ['wasm']);

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

export async function runModel(imageArray, modelVer, setLoading) {
    if (imageArray === undefined) {
        console.log("Why the hell is the image array undefined benson")
        return undefined;
    }
    console.log("Using model: " + modelVer);
    setLoading(true);

    const feeds = prepareImage(imageArray);

    let session = null;
    if (modelVer == "identity") {
        session = identSession;
    } else {
        session = superSession;
    }

    console.log("Running session");
    console.time('run')
    let results = undefined;
    try {
        const output = await session.run(feeds);
        results = output.output;
        setLoading(false);
    } catch (e) {
        setLoading(false);
        console.log("Failed to run model");
        console.log(e)
    }    
    console.timeEnd('run')
    console.log("Session done");
    return results;
}