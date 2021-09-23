const ort = require('onnxruntime-web');

// Cached session state
var session = null;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function initialize(modelVer) {
    const model = './' + modelVer + '.onnx';

    ort.env.wasm.numThreads = 16;
    ort.env.wasm.simd = true;
    ort.env.wasm.proxy = true;

    console.log("(Re)initializing session");
    session = await ort.InferenceSession.create(model, ['wasm']);
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
        return undefined;
    }
    console.log("Using model: " + modelVer);
    setLoading(true);

    const feeds = prepareImage(imageArray);

    try {
        console.log("Running session");
        console.time('run')
        const results = await session.run(feeds);
        console.timeEnd('run')
        console.log("Finished session");
        setLoading(false);
        return results.output;
    } catch (e) {
        setLoading(false);
        console.log("Failed to run model");
        console.log(e)
        return undefined;
    }    
}