/**
 * Convert the given input (either a data URI, URL, or File object) to a data URI and try to extract a filename.
 *
 * @param input The input data URI, URL, or File object.
 * @returns Promise<{dataUri: string, filename: string}> A promise that resolves to an object containing the data URI and the filename.
 */
async function getDataURIFromInput(input: string | File): Promise<{ dataUri: string; filename: string }> {
  let filename = 'example'

  if (input instanceof File) {
    filename = input.name || filename
    const dataUri = await blobToDataUrl(input)
    return { dataUri, filename }
  } else if (typeof input === 'string') {
    filename = extractFilename(input) || filename

    if (isValidHttpUrl(input)) {
      const response = await fetch(input)
      const blob = await response.blob()
      const dataUri = await blobToDataUrl(blob)
      return { dataUri, filename }
    } else {
      return loadImage(input)
        .then(async (img) => {
          const dataUri = imgToDataUrl(img)
          return { dataUri, filename }
        })
        .catch((error) => Promise.reject(new Error('Image load error')))
    }
  } else {
    return Promise.reject(new Error('Invalid input type'))
  }
}

/**
 * Extracts the filename from a URL or a data URI.
 *
 * @param input The URL or data URI.
 * @returns string|null The extracted filename or null if not found.
 */
function extractFilename(input: string): string | null {
  if (isValidHttpUrl(input)) {
    const url = new URL(input)
    const pathname = url.pathname
    return pathname.substring(pathname.lastIndexOf('/') + 1) || null
  }

  if (input.startsWith('data:')) {
    return null
  }

  return null
}

/**
 * Convert a blob to a data URL.
 *
 * @param blob The blob to convert.
 * @returns Promise<string> A promise that resolves to the data URL.
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Load an image from a source.
 *
 * @param src The image source.
 * @returns Promise<HTMLImageElement> A promise that resolves to the loaded image.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Convert an image to a data URL.
 *
 * @param img The image to convert.
 * @returns string The data URL of the image.
 */
function imgToDataUrl(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Unable to get canvas context')
  }
  context.drawImage(img, 0, 0)
  return canvas.toDataURL()
}

/**
 * Check if the given string is a valid HTTP or HTTPS URL.
 *
 * @param url The URL to check.
 * @returns boolean True if the URL is valid, false otherwise.
 */
function isValidHttpUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch (_) {
    return false
  }
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

export { getDataURIFromInput, downloadImage }
