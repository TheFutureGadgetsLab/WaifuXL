const CopyPlugin = require("copy-webpack-plugin");
const withPWA = require("next-pwa");
const path = require("path");

module.exports = withPWA({
  reactStrictMode: true,
  webpack: (config, {  }) => {
    config.plugins.push(
    new CopyPlugin({
        patterns: [
          {
            from: path.join(
              __dirname,
              "node_modules/onnxruntime-web/dist/*.wasm"
            ),
            to: path.join(__dirname, ".next/static/chunks/pages/[name][ext]"),
          },
        ],
      })
    );

    return config;
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});
