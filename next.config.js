/** @type {import('next').NextConfig} */
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const shortHash = require('child_process').execSync('git rev-parse --short HEAD').toString().trim()
const longHash = require('child_process').execSync('git rev-parse HEAD').toString().trim()

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  swcMinify: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: { unoptimized: true },
  output: 'standalone',
  webpack: (config, {}) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/onnxruntime-web/dist/*.wasm',
            to: 'static/chunks/[name][ext]',
          },
        ],
      }),
    )

    config.plugins.push(
      new webpack.DefinePlugin({
        __SHORT_HASH__: JSON.stringify(shortHash),
        __LONG_HASH__: JSON.stringify(longHash),
      }),
    )

    return config
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
