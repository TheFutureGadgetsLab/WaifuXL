/**
 * Given some input, return the data URI from that.
 *
 * @param {string} input Either data URI or URL
 * @returns data URI
 */
function getDataURIFromInput(input) {
  return new Promise(async (resolve, reject) => {
    if (isValidHttpUrl(input)) {
      const blob = await fetch(input).then((r) => r.blob())
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
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
  const link = document.createElement('a')
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

/**
 * Returns whether the given string is a valid http(s) url
 *
 * @param {string} string URL to check
 * @returns Whether the string is a valid URL
 */
function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

async function uploadToImgur(dataURI) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', 'Client-ID e5f8d00a71976ed')

  var formdata = new FormData()
  formdata.append('image', dataURI.slice(22))
  formdata.append('type', 'base64')
  formdata.append('name', 'waifu.png')
  formdata.append('title', 'WaifuXL Upload')
  formdata.append('description', 'WaifuXL Upload')

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  }
  return fetch('https://api.imgur.com/3/credits', requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.success && res.data.ClientRemaining > 10) {
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
        }

        return fetch('https://api.imgur.com/3/image', requestOptions)
          .then((response) => response.json())
          .then((data) => window.open(data.data.link, '_blank', 'noopener,noreferrer'))
          .catch((error) => {
            throw 'Error uploading. Please try again later.'
          })
      } else if (res.success) {
        throw 'Unfortunately, we have reached the upload limit with Imgur. Please try again at a later time.'
      } else {
        throw 'Error reaching Imgur. Please try again later. '
      }
    })
    .catch((err) => {
      throw err
    })
}

export { getDataURIFromInput, downloadImage, setDataURIFromFile, uploadToImgur }
