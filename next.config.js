const isProd = process.env.NODE_ENV === "production";
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
};

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  assetPrefix: ".",
  basePath: isProd ? "/WaifuXL" : "",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.plugins.push(
      new CopyPlugin({
        // Use copy plugin to copy *.wasm to output folder.
        patterns: [
          {
            from: path.join(__dirname, "node_modules/onnxruntime-web/dist/*.wasm"),
            to: path.join(__dirname, ".next/static/chunks/pages/[name][ext]"),
          },
        ],
      })
    );

    return config;
  },
};
