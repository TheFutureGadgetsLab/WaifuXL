import CopyPlugin from 'copy-webpack-plugin'

const outputPath = 'static/chunks/'

// Setup plugins
const copyPlugin = new CopyPlugin({
  patterns: [
    { from: './node_modules/onnxruntime-web/dist/*.wasm', to: `${outputPath}[name][ext]` },
    { from: './public/models', to: outputPath },
  ],
})

// Define Next.js configuration
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  output: process.env.NODE_ENV === 'development' ? 'standalone' : 'export',
  webpack: (config) => {
    config.plugins.push(copyPlugin)
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

export default nextConfig
