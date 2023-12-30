/**
 * Given some input, return the data URI from that.
 *
 * @param input Either data URI or URL
 * @returns Promise<string> - data URI
 */
function getDataURIFromInput(input: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (isValidHttpUrl(input)) {
      const blob = await fetch(input).then((r) => r.blob())
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      resolve(dataUrl)
    } else {
      const img = new Image()
      img.src = input
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Unable to get canvas context'))
          return
        }
        context.drawImage(img, 0, 0)
        resolve(canvas.toDataURL())
      }
      img.onerror = () => reject(new Error('Image load error'))
    }
  })
}

/**
 * Download image to user's computer
 *
 * @param fileName File name
 * @param outputURI Image data URI / URL
 */
function downloadImage(fileName: string, outputURI: string): void {
  const link = document.createElement('a')
  link.download = `${fileName}.png`
  link.href = outputURI
  document.body.appendChild(link) // Needed for Firefox
  link.click()
  document.body.removeChild(link)
}

/**
 * Get data URI from image file
 *
 * @param fileObj File object from file upload or paste event
 * @param setDataURI Callback to set data URI from file
 */
function setDataURIFromFile(fileObj: File, setDataURI: (uri: string) => void): void {
  const reader = new FileReader()
  reader.readAsArrayBuffer(fileObj)

  reader.onloadend = function () {
    let uri: string
    if (fileObj.type === 'image/gif') {
      uri = 'data:' + fileObj.type + ';base64,' + Buffer.from(reader.result as ArrayBuffer).toString('base64')
    } else {
      const blob = new Blob([reader.result as ArrayBuffer], { type: fileObj.type })
      const urlCreator = window.URL || window.webkitURL
      uri = urlCreator.createObjectURL(blob)
    }
    setDataURI(uri)
  }
}

/**
 * Returns whether the given string is a valid http(s) url
 *
 * @param url URL to check
 * @returns Whether the string is a valid URL
 */
function isValidHttpUrl(url: string): boolean {
  let parsedUrl

  try {
    parsedUrl = new URL(url)
  } catch (_) {
    return false
  }

  return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
}

export { getDataURIFromInput, downloadImage, setDataURIFromFile }
