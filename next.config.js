/** @type {import('next').NextConfig} */
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const shortHash = require('child_process').execSync('git rev-parse --short HEAD').toString().trim()
const longHash = require('child_process').execSync('git rev-parse HEAD').toString().trim()

const copyPlugin = new CopyPlugin({
  patterns: [
    {
      from: './node_modules/onnxruntime-web/dist/*.wasm',
      to: 'static/chunks/app/[name][ext]',
    },
    {
      from: './public/models',
      to: 'static/chunks/app',
    },
  ],
})

const hashPlugin = new webpack.DefinePlugin({
  __SHORT_HASH__: JSON.stringify(shortHash),
  __LONG_HASH__: JSON.stringify(longHash),
})

const config = {
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
    config.plugins.push(copyPlugin)
    config.plugins.push(hashPlugin)

    return config
  },
  async headers() {
    if (process.env.NODE_ENV === 'development') {
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
    }
    return []
  },
}

module.exports = config
