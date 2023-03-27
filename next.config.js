const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' // Disable PWA in development
})

// get git info from command line
const shortHash = require('child_process').execSync('git rev-parse --short HEAD').toString().trim()
const longHash = require('child_process').execSync('git rev-parse HEAD').toString().trim()

module.exports = withPWA({
  reactStrictMode: false,
  images: { unoptimized: true }, // disable next/image optimization as doesn't work with static export
  webpack: (config, { }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/onnxruntime-web/dist/*.wasm',
            to: 'static/chunks/pages/[name][ext]' 
          }
        ]
      })
    )

    config.plugins.push(new webpack.DefinePlugin({
      __SHORT_HASH__: JSON.stringify(shortHash),
      __LONG_HASH__: JSON.stringify(longHash)
    }))

    return config
  }
})
