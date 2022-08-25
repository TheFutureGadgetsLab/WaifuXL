const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
})

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
});
