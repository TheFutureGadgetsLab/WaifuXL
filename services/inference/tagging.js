import ndarray from 'ndarray'

export async function getTopTags(data) {
  const tags = await loadTags()
  const flattened = ndarray(data.data, data.dims)

  const topDesc = topK(flattened, 2000, 0, 2000).map((i) => [tags[i[0]], i[1]])
  const topChars = topK(flattened, 2000, 2000, 4000).map((i) => [tags[i[0]], i[1]])
  const rating = topK(flattened, 3, 4000, 4003).map((i) => [tags[i[0]], i[1]])

  return { topDesc, topChars, rating }
}

async function loadTags() {
  const tags = await fetch('./tags.json')
  const tagsJson = await tags.json()
  const tagsArray = tagsJson.map((tag) => tag[1])
  return tagsArray
}

// find indices of top k values in ndarray
function topK(ndarray, k, startIndex, stopIndex) {
  const values = ndarray.data.slice(startIndex, stopIndex)
  const indices = [...Array(values.length).keys()]
  indices.sort((a, b) => values[b] - values[a])

  // zip indices and values into an array of tuples
  const tuples = indices.map((i) => [i + startIndex, values[i]])
  return tuples.slice(0, k)
}
