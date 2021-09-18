const ort = require('onnxruntime-web');

// use an async context to call onnxruntime functions.
async function sample(imageArray) {
    if(imageArray) {
        try {
            console.log("original input array");
            console.log(imageArray);
            const height = imageArray.shape[2];
            const width = imageArray.shape[3];
            const session = await ort.InferenceSession.create('./fixedSuperRes.onnx', {executionProviders: ["wasm"]});

            console.log("Session created");
            // prepare inputs. a tensor need its corresponding TypedArray as data
            const tensor = new ort.Tensor('uint8', imageArray.data, [1,3,height,width]);
            // prepare feeds. use model input names as keys.
            const feeds = { input: tensor };
            console.log("Running session");
            // feed inputs and run
            const results = await session.run(feeds);
            console.log("Outputting results");
            // read from results
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

export default sample;