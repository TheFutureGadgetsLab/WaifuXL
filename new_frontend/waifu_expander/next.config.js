/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
};

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.plugins.push(
      new CopyPlugin({
        // Use copy plugin to copy *.wasm to output folder.
        patterns: [
          {
            from: "node_modules/onnxruntime-web/dist/*.wasm",
            to: "[name][ext]",
          },
        ],
      })
    );
    
    console.log(config);
    return config;
  },
};
