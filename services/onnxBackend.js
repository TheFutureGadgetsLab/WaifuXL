const ort = require('onnxruntime-web');

// Cached session state
var superSession = null;
var tagSession   = null;

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
  
function copy(src)  {
    var dst = new ArrayBuffer(src.byteLength);
    new Uint8Array(dst).set(new Uint8Array(src));
    return dst;
}

export async function initializeONNX() {
    ort.env.wasm.numThreads = navigator.hardwareConcurrency / 2;
    ort.env.wasm.simd       = true;
    ort.env.wasm.proxy      = true;

    if (typeof fetch !== 'undefined') {
        const superResponse = await fetch('./models/superRes.onnx');
        const tagResponse = await fetch('./models/tagger.onnx');

        // console.log("Fetched successfuly")
        // let superBuffer = await superResponse.arrayBuffer();
        // let tagBuffer = await tagResponse.arrayBuffer();
        // const testing = new Uint8Array(superBuffer);
        // console.log("Succesfully created Uint8Array");
        // superBuffer = copy(superBuffer);
        // tagBuffer = copy(tagBuffer);
        // console.log("Converted to array buffer successfully");
        superSession = await ort.InferenceSession.create("./models/superRes.onnx", {
            executionProviders: ["wasm"],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
            enableMemPattern: true,
            executionMode: 'parallel',
        });
        tagSession = await ort.InferenceSession.create('./models/tagger.onnx', {
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
    else {
        console.log("No fetch")
    }
    
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
    // console.assert(typeof fetch !== "undefined");
    // const response = await fetch(filepathOrUri);
    // const reader = response.body.getReader();
    // const length = parseInt(response.headers.get("content-length"));
    // let data = new Uint8Array(length);
    // let received = 0;

    // // Loop through the response stream and extract data chunks
    // while (true) {
    //     const { done, value } = await reader.read();

    //     if (done) {
    //         break;
    //     } else {
    //         // Push values to the chunk array
    //         data.set(value, received);
    //         received += value.length;
    //     }
    // }
    // return data.buffer;
    if (typeof fetch !== 'undefined') {
        const response = await fetch(filepathOrUri);
        return await response.arrayBuffer();
    }

}
