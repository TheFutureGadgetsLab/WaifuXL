import { UI_CONFIG } from '@/constants'

export const downloadImage = (outputURI: string | null): void => {
  if (outputURI) {
    const link = document.createElement('a')
    link.href = outputURI
    link.download = 'superRes.png'
    link.click()
  }
}

// Output URI can be null. Returns true if copy succeeded, false otherwise.
export const copyImageToClipboard = async (outputURI: string | null): Promise<boolean> => {
  if (!outputURI) return false
  try {
    const imgBlob = await (await fetch(outputURI)).blob()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': imgBlob })])
    return true
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error)
    return false
  }
}

export const truncateString = (str: string): string => {
  const cleaned = str
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
    .split('(')[0]
    .replace(/_/g, ' ')
  return cleaned.length > UI_CONFIG.truncateStringLength
    ? cleaned.slice(0, UI_CONFIG.truncateStringLength) + '…'
    : cleaned
}

type ImageInput = string | File

export async function getImageURI(input: ImageInput): Promise<string> {
  if (input instanceof File) {
    return URL.createObjectURL(input)
  }

  if (typeof input === 'string') {
    const dataUri = isValidHttpUrl(input)
      ? URL.createObjectURL(await (await fetch(input)).blob())
      : await new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            canvas.getContext('2d')?.drawImage(img, 0, 0)
            resolve(canvas.toDataURL())
          }
          img.onerror = () => reject(new Error('Image load error'))
          img.src = input
        })

    return dataUri
  }

  throw new Error('Invalid input type')
}

function isValidHttpUrl(url: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol)
  } catch {
    return false
  }
}
