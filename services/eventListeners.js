import { getDataURIFromInput, setDataURIFromFile } from '../services/imageUtilities'

function handleInputFile(items, setFileName, setInputURI) {
  try {
    for (let index in items) {
      let item = items[index]
      if (item.kind === 'file') {
        let file = item.getAsFile()
        setFileName(file.name.split('/').at(-1).split('.')[0])
        setDataURIFromFile(file, setInputURI)
        return true
      }
    }
  } catch (e) {
    console.error(e)
    console.error('Unable to handle input image')
    return false
  }
}

const pasteListener = (e, setInputURI, setFileName, setShowSidebar, setInputModalOpen) => {
  if (e.clipboardData.getData('text/plain')) {
    let url = e.clipboardData.getData('text/plain')
    console.log(url)
    getDataURIFromInput(url).then((u) => {
      setInputURI(u)
    })
    setFileName(url.split('/').at(-1).split('.')[0])
    success = true
  } else {
    const success = handleInputFile((e.clipboardData || e.originalEvent.clipboardData).items, setFileName, setInputURI)
    if (success) {
      console.log('Succesful...')
      setShowSidebar(true)
      setInputModalOpen(true)
    }
  }
}

const dropListener = (e, setFileName, setInputURI, setShowSidebar, setInputModalOpen) => {
  e.preventDefault()
  e.stopPropagation()
  const success = handleInputFile(e.dataTransfer.items, setFileName, setInputURI)
  if (success) {
    console.log('Succesful drag')
    setShowSidebar(true)
    setInputModalOpen(true)
    setFileName(e.dataTransfer.files[0].name.split('/').at(-1).split('.')[0])
  }
}

const preventDefault = (e) => {
  e.preventDefault()
}

export { pasteListener, preventDefault, dropListener }
