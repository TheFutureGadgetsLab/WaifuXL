/** @type {import('next').NextConfig} */
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const shortHash = require('child_process').execSync('git rev-parse --short HEAD').toString().trim()
const longHash = require('child_process').execSync('git rev-parse HEAD').toString().trim()

var outpath;
if (process.env.NODE_ENV === 'development') {
  outpath = "static/chunks/app/"
} else {
  outpath = "static/chunks/"
}


const copyPlugin = new CopyPlugin({
  patterns: [
    {
      from: './node_modules/onnxruntime-web/dist/*.wasm',
      to: outpath + '[name][ext]',
    },
    {
      from: './public/models',
      to: outpath
    },
  ],
})

const hashPlugin = new webpack.DefinePlugin({
  __SHORT_HASH__: JSON.stringify(shortHash),
  __LONG_HASH__: JSON.stringify(longHash),
})

const config = {
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: { unoptimized: true },
  output: process.env.NODE_ENV === 'development' ? 'standalone' : 'export',
  webpack: (config, {}) => {
    config.plugins.push(copyPlugin)
    config.plugins.push(hashPlugin)

    return config
  },
}
if (process.env.NODE_ENV === 'development') {
  module.exports = {
    ...config,
    ...{
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
            // Apply these headers to donation route (allow iframe from Ko-fi)
            source: '/donate',
            headers: [
              {
                key: 'Cross-Origin-Embedder-Policy',
                value: 'unsafe-none',
              },
              {
                key: 'Cross-Origin-Opener-Policy',
                value: 'same-origin',
              },
            ],
          },
        ]
      },
    },
  }
} else {
  module.exports = config
}
