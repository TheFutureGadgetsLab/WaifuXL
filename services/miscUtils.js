/**
 * Returns whether the given string is a valid http(s) url
 *
 * @param {string} string URL to check
 * @returns Whether the string is a valid URL
 */
export function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
