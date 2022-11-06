import { downloadImage, getDataURIFromInput, uploadToImgur } from '@/services/imageUtilities'
import { DownloadSVG, CopySVG } from '@/components/SVGComponents'
import { useImageStore, useAppStateStore } from '@/services/useState'
import { setDataURIFromFile } from '@/services/imageUtilities'

export function DownloadComponent() {
  const [fileName, extension, outputURI, hasntRun] = useImageStore((state) => [
    state.fileName,
    state.extension,
    state.outputURI,
    state.hasntRun,
  ])

  return (
    <button
      className={`text-white h-12 mt-1 lg:h-9 font-bold py-2 px-2 md:px-4 rounded drop-shadow-lg bg-pink inline-flex items-center disabled:bg-gray-400 disabled:opacity-60 disabled:text-white disabled:cursor-not-allowed
        ${hasntRun ? '' : 'animate-pulse'}`}
      onClick={() => downloadImage(fileName, extension, outputURI)}
      disabled={hasntRun}
    >
      <div className="hidden md:block">
        <DownloadSVG />
      </div>
      <span>Download</span>
    </button>
  )
}

export function CopyComponent() {
  const [outputURI, hasntRun] = useImageStore((state) => [state.outputURI, state.hasntRun])
  return (
    <button
      className={`h-12 mt-1 lg:h-9 text-white font-bold py-2 px-2 md:px-4 rounded drop-shadow-lg bg-pink inline-flex items-center disabled:bg-gray-400 disabled:opacity-60 disabled:text-white disabled:cursor-not-allowed
        ${hasntRun ? '' : 'animate-pulse'}`}
      onClick={(e) => {
        uploadToImgur(outputURI)
      }}
      disabled={hasntRun}
    >
      <div className="hidden md:block">
        <CopySVG />
      </div>
      <span>Post To Imgur</span>
    </button>
  )
}

export function PresetSelectorComponent() {
  const [setInputURI, setFileName] = useImageStore((state) => [state.setInputURI, state.setFileName])

  return (
    <label>
      <span className="text-gray-700">Preset Images</span>
      <select
        id="preset-select"
        className="form-select border-none rounded mt-1 block text-ellipsis w-full p-3 bg-blue text-white cursor-pointer"
        onInput={(inp) => {
          const [name, url] = inp.target.value.split('|')
          getDataURIFromInput(url).then((uri) => setInputURI(uri))
          setFileName(`example_${name}`)
        }}
      >
        <option>Select a Preset</option>
        <option value="ozen|https://i.imgur.com/Sf6sfPj.png">Ozen</option>
        <option value="eat|https://c.tenor.com/rnhV3fu39f8AAAAM/eating-anime.gif">Eating (GIF)</option>
        <option value="senjougahara|https://i.imgur.com/cMX8YcK.jpg">Hitagi Senjougahara</option>
        <option value="moomin|https://i.imgur.com/9I91yMq.png">Moomin</option>
        <option value="megumin|https://i.imgur.com/BKBt6bC.png">Megumin</option>
        <option value="aqua|https://i.imgur.com/yhIwVjZ.jpeg">Aqua</option>
        <option value="natsumi|https://i.imgur.com/yIIl7Z1.png">Kurobe Natsumi</option>
      </select>
    </label>
  )
}

export function UploadButtonComponent() {
  const setFileName = useImageStore((state) => state.setFileName)
  const setInputURI = useImageStore((state) => state.setInputURI)

  return (
    <div className="grid grid-cols-1">
      <button
        id="upload-button"
        type="button"
        className="relative mt-1 lg:mt-7 rounded right-0 bottom-0 text-white shadow-sm px-2 md:px-4 py-1
text-base font-medium h-12 border-blue border-2 bg-blue disabled:bg-white disabled:text-gray-200 disabled:border-gray-200"
      >
        <label className="absolute left-0 top-0 w-full h-full cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) {
                setDataURIFromFile(e.target.files[0], setInputURI)
                setFileName(e.target.files[0].name.split('.')[0])
              }
            }}
          />
        </label>
        Upload
      </button>
    </div>
  )
}

export function DoneButtonComponent() {
  const setTags = useImageStore((state) => state.setTags)
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const inputURI = useImageStore((state) => state.inputURI)

  return (
    <div className="md:grid-cols-1 md:grid hidden">
      <button
        id="done-button"
        type="button"
        className="mt-7 rounded-md right-0 bottom-0 text-blue shadow-sm px-4 py-1
text-base font-medium h-12 focus:outline-none focus:ring-2 focus:ring-offset-2
border-blue border-2 bg-white hover:bg-blue hover:text-white disabled:bg-white disabled:text-gray-200 disabled:border-gray-200"
        onClick={() => {
          setInputURI(inputURI)
          setTags(null)
          setInputModalOpen(false)
        }}
      >
        Done
      </button>
    </div>
  )
}
