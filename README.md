# Waifu Expander
Waifu Expander is a state of the art super resolution model based on the [Real-ESRGAN](https://arxiv.org/abs/2107.10833). This model has been trained on ~1,000,000 anime style images from the [Danbooru2020](https://www.gwern.net/Danbooru2020) dataset.

# Embiggen your Megumins
Simply provide a link in the left most box on the bottom, select Super Resolution from the drop down, display the image, and hit upscale!

# Comparison to Waifu2x
Later, when we have the full model trained.

# Performance
[ONNX Runtime's](https://github.com/microsoft/onnxruntime) supports SIMD acceleration and multithreading, using a beefier computer will definitely speed things up!

# ONNX Install
Uninstall `onnxruntime-common` and `onnxruntime-web`, then run
```
npm install ./onnx_deps/onnxruntime-common-1.9.0.tgz
npm install ./onnx_deps/onnxruntime-web-1.9.0.tgz
```
