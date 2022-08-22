import { isValidHttpUrl } from './miscUtils'

/**
 * Given some input, return the data URI from that.
 *
 * @param {string} input Either data URI or URL
 * @returns data URI
 */
function getDataURIFromInput(input) {
  return new Promise(async (resolve, reject) => {
    if (isValidHttpUrl(input)) {
      let blob = await fetch(input).then((r) => r.blob())
      let dataUrl = await new Promise((resolve) => {
        let reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
      resolve(dataUrl)
    } else {
      const img = new Image()
      img.src = input
      img.crossOrigin = 'Anonymous'
      var results = null
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext('2d')
        context.drawImage(img, 0, 0)
        resolve(canvas.toDataURL())
      }
    }
  })
}

/**
 * Download image to user's computer
 *
 * @param {string} imgURI Image data URI / URL
 * @param {string} extension File extension
 * @param {string} fileName File name
 */
function downloadImage(fileName, extension, outputURI) {
  let link = document.createElement('a')
  link.download = `${fileName}.${extension}`
  link.href = outputURI
  link.click()
}

/**
 * Get data URI from image, passing it to a callback
 *
 * @param {File} fileObj File object from file upload or paste event
 * @param {Function} setDataURI Callback to set data URI from file
 */
function setDataURIFromFile(fileObj, setDataURI) {
  const fr = new FileReader()
  fr.onload = function () {
    setDataURI(fr.result)
  }
  fr.readAsDataURL(fileObj)
}

export { getDataURIFromInput, downloadImage, setDataURIFromFile }
