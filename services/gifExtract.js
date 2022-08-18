'use strict'

const pify = require('pify')
const getPixels = pify(require('get-pixels'))

const supportedFormats = new Set(['gif'])

module.exports = async (opts) => {
  const { input, coalesce = true } = opts

  const format = undefined

  if (format && !supportedFormats.has(format)) {
    throw new Error(`invalid output format "${format}"`)
  }

  const results = await getPixels(input)
  const { shape } = results

  if (shape.length === 4) {
    // animated gif with multiple frames
    const [frames, width, height, channels] = shape

    const numPixelsInFrame = width * height

    for (let i = 0; i < frames; ++i) {
      if (i > 0 && coalesce) {
        const currIndex = results.index(i, 0, 0, 0)
        const prevIndex = results.index(i - 1, 0, 0, 0)

        for (let j = 0; j < numPixelsInFrame; ++j) {
          const curr = currIndex + j * channels

          if (results.data[curr + channels - 1] === 0) {
            const prev = prevIndex + j * channels

            for (let k = 0; k < channels; ++k) {
              results.data[curr + k] = results.data[prev + k]
            }
          }
        }
      }
    }
  }

  return results
}
