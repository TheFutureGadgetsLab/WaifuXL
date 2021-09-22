const ort = require('onnxruntime-web');

async function loadSession(modelVer) {
    const model = './' + modelVer + '.onnx';

    ort.env.logLevel = "verbose";
    ort.env.debug = true;
    ort.env.wasm.numThreads = 16;
    ort.env.wasm.simd = true;
    ort.env.wasm.proxy = true;

    console.log("Initializing session");
    const session = await ort.InferenceSession.create(model, {
        executionProviders: ["wasm"],
        logSeverityLevel: 0,
        logVerbosityLevel: 2,
        graphOptimizationLevel: 'all',
        enableCpuMemArena: true,
        enableMemPattern: true,
        executionMode: 'parallel',
    });

    return session;
}

function prepareImage(imageArray) {
    const height = imageArray.shape[2];
    const width = imageArray.shape[3];
    const tensor = new ort.Tensor('uint8', imageArray.data, [1,3,height,width]);
    return { input: tensor };
}

async function runModel(imageArray, modelVer, setLoading) {
    if (imageArray === undefined) {
        return undefined;
    }
    console.log("Using model: " + modelVer);
    setLoading(true);
    let session;
    try {
        session = await loadSession(modelVer);
    } catch (e) {
        console.log("Failed to initialize ONNX session");
        console.log(e);
        return undefined;
    }

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

export default runModel;