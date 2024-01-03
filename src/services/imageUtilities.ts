/**
 * Convert the given input (either a data URI, URL, or File object) to a data URI.
 *
 * @param input The input data URI, URL, or File object.
 * @returns Promise<{dataUri: string, filename: string}> A promise resolving to an object containing the data URI and filename.
 */
async function getDataURIFromInput(input: string | File): Promise<{ dataUri: string; filename: string }> {
  const filename = 'superRes'

  if (input instanceof File) {
    return { dataUri: URL.createObjectURL(input), filename }
  }

  if (typeof input === 'string') {
    if (isValidHttpUrl(input)) {
      const response = await fetch(input)
      const blob = await response.blob()
      return { dataUri: URL.createObjectURL(blob), filename }
    }

    const img = await loadImage(input).catch(() => {
      throw new Error('Image load error')
    })

    return { dataUri: imgToDataUrl(img), filename }
  }

  throw new Error('Invalid input type')
}

/**
 * Load an image from a source.
 *
 * @param src The image source.
 * @returns Promise<HTMLImageElement> A promise resolving to the loaded image.
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
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Unable to get canvas context')
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL()
}

/**
 * Check if a given string is a valid HTTP or HTTPS URL.
 *
 * @param url The URL to check.
 * @returns boolean True if the URL is valid, false otherwise.
 */
function isValidHttpUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

/**
 * Download image to user's computer.
 *
 * @param fileName File name.
 * @param outputURI Image data URI / URL.
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
