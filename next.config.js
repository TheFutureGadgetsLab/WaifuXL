const CopyPlugin = require("copy-webpack-plugin");
const withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  webpack: (config, {  }) => {
    config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: './node_modules/onnxruntime-web/dist/ort-wasm.wasm',
          to: 'static/chunks/pages',
        },             {
          from: './node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
          to: 'static/chunks/pages',
        },          
        ],
      }),
    );

    return config;
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});
