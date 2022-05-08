# ![](https://i.imgur.com/lPsvvh7.png) Waifu Expander
Waifu Expander is a state of the art super resolution model trained on  ~1,200,000 anime style images from the [Danbooru2021](https://www.gwern.net/Danbooru2021) dataset. You cant find it online at https://waifuxl.com/. Note that while you *can* upscale natural (real) images, the model was only trained on anime style drawings, so dont expect to have your socks blown off.

# How it Works
Using the [Onnx Runtime](https://onnxruntime.ai/), we stream the weights of our ML models directly onto your device to be executed locally in WebAssembly. Doing so allows us to provide this service solely through a static webpage, no backend for model execution needed. This has the added benefit of enabling the privacy of your images--your images are not, and never will be, sent to us.

## Models
For our super resolution network we are using the state-of-the-art [Real-ESRGAN](https://arxiv.org/abs/2107.10833) and for our image tagging network we are using a [MobileNetV3](https://arxiv.org/abs/1905.02244). Both were trained on a subset of [Danbooru2021](https://www.gwern.net/Danbooru2021).

## Website
[Onnx Runtime](https://onnxruntime.ai/) is multithreaded and supports SIMD instructions--while upscaling on a phone or a laptop is suprisingly quick, using a beefier computer will bring noticable benefits. We're hosted on [Cloudflare Pages](https://pages.cloudflare.com/) which provides unlimited bandwidth.

Alec, please fill out a section describing how we made our ferociously sexy website.

# Comparison to Waifu2x
In general, the [Real-ESRGAN](https://arxiv.org/abs/2107.10833) will outperform the models used on [waifu2x](http://waifu2x.udp.jp/) by a significant margin, without the need for multiple models trained on various noise reduction levels.

Update this to look better and with final model. Maybe a different image?
![](https://i.imgur.com/BDv4rd9.png)

# Contribution Guide
If you'd like to contribute there are a number of aveneus where you can do so:

## Code / Website
We're definitely open to code contributions, whether it be code cleanup, new features, or bug fixes. Simply open a discussion so we all can collaborate and discuss the merit of your ideas!

## Ideas
We have plenty of things we'd like to add to [WaifuXL](https://waifuxl.com/), if you have a suggestion simply open a discussion and we can start talking! Here are a few things we have in mind:
  - [Style Transfer](https://en.wikipedia.org/wiki/Neural_style_transfer) so you can apply an anime style to real images.
  - Easter eggs. We have a tagger that can match thousands of tags, maybe we can have something like a cool fireworks effect if you upscale a top-tier waifu (i.e. Truck-kun).

## Donations
We're open to donations, just head to https://waifuxl.com/donate and see the ways you can contribute. We want to make it clear that we are providing this service to you, free of cost, because it is free of cost to *us*. We have no backend and [Cloudflare Pages](https://pages.cloudflare.com/) provides unlimited bandwidth for free. Please don't feel obligated to donate even if you find yourself using this service frequently.

On top of donations, we're open to compute contributions (GPU's). We'd like to train a better tagger and continue to update the super resolution model as new SOTA models are published. We'd also like to train a model on natural (real images) so we can upscale more than drawings, and maybe a style transfer model. All of this takes a lot of compute which we simply dont have. If you have the means and you're feeling generous, drop us a line.
