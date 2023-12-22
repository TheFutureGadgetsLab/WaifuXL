import { downloadImage, getDataURIFromInput, uploadToImgur } from '@/services/imageUtilities'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { Button } from '@/components/catalyst/button'
import { ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/16/solid'
import { setDataURIFromFile } from '@/services/imageUtilities'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Select } from '@/components/catalyst/select'

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
    <Field>
      <Label>Preset Images</Label>
      <Select
        value={selectedPreset}
        onChange={(inp) => {
          setSelectedPreset(inp.target.value)
          const [name, url] = inp.target.value.split('|')
          getDataURIFromInput(url).then((uri) => setTempURI(uri))
          setTempFileName(`example_${name}`)
        }}
      >
        <option value="ozen|https://i.imgur.com/Sf6sfPj.png">Ozen</option>
        <option value="eat|https://c.tenor.com/rnhV3fu39f8AAAAM/eating-anime.gif">Eating (GIF)</option>
        <option value="senjougahara|https://i.imgur.com/cMX8YcK.jpg">Senjougahara</option>
        <option value="moomin|https://i.imgur.com/9I91yMq.png">Moomin</option>
        <option value="megumin|https://i.imgur.com/BKBt6bC.png">Megumin</option>
        <option value="aqua|https://i.imgur.com/yhIwVjZ.jpeg">Aqua</option>
        <option value="natsumi|https://i.imgur.com/yIIl7Z1.png">Kurobe Natsumi</option>
      </Select>
    </Field>
  )
}

export function UploadButtonComponent() {
  const { setTempFileName, setTempURI, setInputURI } = useImageStore()
  const setSelectedPreset = useAppStateStore((state) => state.setSelectedPreset)
  const mobile = useAppStateStore((state) => state.mobile)

  return (
    <Field className="grid grid-cols-1">
      <Label className="text-white">
        Upload Button
      </Label>
      <Button
      color="blue"
      className="max-h-9 mt-3"
      >
        <label>
          <input
            type="file"
            accept="image/*"
            // TODO: replace with better looking upload component, for now just real ugly
            // className="hidden"
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
      </Button>
    </Field>
  )
}

export function DoneButtonComponent() {
  const { setTags, setInputURI, tempURI } = useImageStore()
  const { setInputModalOpen, setSelectedPreset } = useAppStateStore()

  return (
    <Field className="md:grid-cols-1 md:grid hidden">
      <Label className="text-white">Done Button</Label>
      <Button
        className="max-h-9 mt-3"
        outline
        color="blue"
        onClick={() => {
          setInputURI(tempURI)
          setTags(null)
          setInputModalOpen(false)
          setSelectedPreset('')
        }}
      >
        Done
      </Button>
    </Field>
  )
}
