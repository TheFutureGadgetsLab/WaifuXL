const ort = require('onnxruntime-web');

async function runModel(imageArray) {
    if(imageArray) {
        try {
            const height = imageArray.shape[2];
            const width = imageArray.shape[3];
            ort.env.logLevel = "verbose";
            ort.env.debug = true;
            ort.env.wasm.numThreads = 16;
            const session = await ort.InferenceSession.create('./identity.onnx', {
                executionProviders: ["wasm"],
                logSeverityLevel: 0,
                logVerbosityLevel: 2,
                executionMode: "parallel"
            });
            ort.env.logLevel = "verbose";
            ort.env.debug = true;
            ort.env.wasm.numThreads = 16;
            const tensor = new ort.Tensor('uint8', imageArray.data, [1,3,height,width]);
            const feeds = { input: tensor };
            const results = await session.run(feeds);
            return results.output;
        } catch (e) {
            console.log("Broke");
            console.log(e)
            return undefined;
        }    
    } else {
        return undefined;
    }
}

export default runModel;