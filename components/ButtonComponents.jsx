import { downloadImage, getDataURIFromInput, uploadToImgur } from '@/services/imageUtilities'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { Button } from '@/components/catalyst/button'
import { ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/16/solid'
import { setDataURIFromFile } from '@/services/imageUtilities'

export function DownloadComponent() {
  const { fileName, extension, outputURI, hasntRun } = useImageStore()

  return (
    <Button
      color="pink"
      onClick={() => downloadImage(fileName, extension, outputURI)}
      disabled={hasntRun}
    >
      <ArrowDownTrayIcon/>
      <span className="text-white">Download</span>
    </Button>
  )
}

export function CopyComponent() {
  const { outputURI, hasntRun } = useImageStore()
  const { setFeedbackMessage, isUploading, setIsUploading } = useAppStateStore()

  return (
    <Button
    color="pink"
    onClick={(e) => {
        setIsUploading(true)
        uploadToImgur(outputURI)
          .then(() => setIsUploading(false))
          .catch((err) => {
            setFeedbackMessage(err)
            setIsUploading(false)
          })
      }}
      disabled={hasntRun}
    >
      {isUploading ? <ClipboardIcon /> : <ClipboardIcon />}
      <span className="text-white">Post To Imgur</span>
    </Button>
  )
}

export function PresetSelectorComponent() {
  const { setTempURI, setTempFileName } = useImageStore()
  const { selectedPreset, setSelectedPreset } = useAppStateStore()

  return (
    <label>
      <span className="text-gray-700">Preset Images</span>
      <select
        id="preset-select"
        value={selectedPreset}
        className="form-select border-none rounded mt-1 block text-ellipsis w-full p-3 bg-blue text-white cursor-pointer"
        onInput={(inp) => {
          setSelectedPreset(inp.target.value)
          const [name, url] = inp.target.value.split('|')
          getDataURIFromInput(url).then((uri) => setTempURI(uri))
          setTempFileName(`example_${name}`)
        }}
      >
        <option>Select a Preset</option>
        <option value="ozen|https://i.imgur.com/Sf6sfPj.png">Ozen</option>
        <option value="eat|https://c.tenor.com/rnhV3fu39f8AAAAM/eating-anime.gif">Eating (GIF)</option>
        <option value="senjougahara|https://i.imgur.com/cMX8YcK.jpg">Senjougahara</option>
        <option value="moomin|https://i.imgur.com/9I91yMq.png">Moomin</option>
        <option value="megumin|https://i.imgur.com/BKBt6bC.png">Megumin</option>
        <option value="aqua|https://i.imgur.com/yhIwVjZ.jpeg">Aqua</option>
        <option value="natsumi|https://i.imgur.com/yIIl7Z1.png">Kurobe Natsumi</option>
      </select>
    </label>
  )
}

export function UploadButtonComponent() {
  const { setTempFileName, setTempURI, setInputURI } = useImageStore()
  const setSelectedPreset = useAppStateStore((state) => state.setSelectedPreset)
  const mobile = useAppStateStore((state) => state.mobile)

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
            accept="image/*"
            className="hidden"
            onInput={(e) => {
              if (e.target.files[0]) {
                if (mobile) {
                  setDataURIFromFile(e.target.files[0], setInputURI)
                } else {
                  setDataURIFromFile(e.target.files[0], setTempURI)
                }
                setTempFileName(e.target.files[0].name.split('.')[0])
                setSelectedPreset('')
              }
            }}
            onChange={(e) => {
              if (e.target.files[0]) {
                if (mobile) {
                  setDataURIFromFile(e.target.files[0], setInputURI)
                } else {
                  setDataURIFromFile(e.target.files[0], setTempURI)
                }
                setTempFileName(e.target.files[0].name.split('.')[0])
                setSelectedPreset('')
              }
            }}
            onClick={(e) => {
              e.target.value = null
            }}
          />
        </label>
        Upload
      </button>
    </div>
  )
}

export function DoneButtonComponent() {
  const { setTags, setInputURI, tempURI } = useImageStore()
  const { setInputModalOpen, setSelectedPreset } = useAppStateStore()

  return (
    <div className="md:grid-cols-1 md:grid hidden">
      <button
        id="done-button"
        type="button"
        className="mt-7 rounded-md right-0 bottom-0 text-blue shadow-sm px-4 py-1
text-base font-medium h-12 focus:outline-none focus:ring-2 focus:ring-offset-2
border-blue border-2 bg-white hover:bg-blue hover:text-white disabled:bg-white disabled:text-gray-200 disabled:border-gray-200"
        onClick={() => {
          setInputURI(tempURI)
          setTags(null)
          setInputModalOpen(false)
          setSelectedPreset('')
        }}
      >
        Done
      </button>
    </div>
  )
}
