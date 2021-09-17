const ort = require('onnxruntime-web');

// use an async context to call onnxruntime functions.
async function sample(imageArray) {
    if(imageArray) {
        try {
            console.log(imageArray);
            const height = imageArray.shape[2];
            const width = imageArray.shape[3];
            const session = await ort.InferenceSession.create('./fucknames.onnx');
            // prepare inputs. a tensor need its corresponding TypedArray as data
            const tensor = new ort.Tensor('float32', imageArray.data, [1,3,height,width]);
            // prepare feeds. use model input names as keys.
            const feeds = { input: tensor };
    
            // feed inputs and run
            const results = await session.run(feeds);
    
            // read from results
            return results.output;
        } catch (e) {
            console.log(e)
            return undefined;
        }    
    } else {
        return undefined;
    }
}

export default sample;