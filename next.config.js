const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const execSync = require('child_process').execSync

// Fetch git hashes
const shortHash = execSync('git rev-parse --short HEAD').toString().trim()
const longHash = execSync('git rev-parse HEAD').toString().trim()

// Define output path for copied files
const outputPath = 'static/chunks/'

// Setup plugins
const copyPlugin = new CopyPlugin({
  patterns: [
    { from: './node_modules/onnxruntime-web/dist/*.wasm', to: `${outputPath}[name][ext]` },
    { from: './public/models', to: outputPath },
  ],
})

const hashPlugin = new webpack.DefinePlugin({
  __SHORT_HASH__: JSON.stringify(shortHash),
  __LONG_HASH__: JSON.stringify(longHash),
})

// Define Next.js configuration
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  output: process.env.NODE_ENV === 'development' ? 'standalone' : 'export',
  webpack: (config) => {
    config.plugins.push(copyPlugin, hashPlugin)
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        source: '/donate',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ]
  },
  modularizeImports: {
    '@mui/icons-material': { transform: '@mui/icons-material/{{member}}' },
  },
}

module.exports = nextConfig
