import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from '@mui/material'
import { CloudDownload, CloudUpload, CopyAll, Done, RunCircle } from '@mui/icons-material'
import { useAppStateStore, useImageStore } from '@/services/useState'

import ButtonComponent from './button'
import { downloadImage } from '@/services/imageUtilities'
import { getEmptyTags } from '@/services/inference/utils'
import { upScaleFromURI } from '@/services/inference/utils'

const preset_list = [
  {
    name: 'Ozen',
    url: 'https://i.imgur.com/Sf6sfPj.png',
  },
  {
    name: 'Senjougahara',
    url: 'https://i.imgur.com/cMX8YcK.jpg',
  },
  {
    name: 'Moomin',
    url: 'https://i.imgur.com/9I91yMq.png',
  },
  {
    name: 'Megumin',
    url: 'https://i.imgur.com/BKBt6bC.png',
  },
  {
    name: 'Aqua',
    url: 'https://i.imgur.com/yhIwVjZ.jpeg',
  },
  {
    name: 'Natsumi',
    url: 'https://i.imgur.com/yIIl7Z1.png',
  },
]

const modalButtonSx = {
  marginBottom: 2,
  ':not(:last-child)': {
    marginBottom: 1,
  },
  color: 'secondary.main',
}

const ModalUpload = () => {
  const { running, setInputModalOpen } = useAppStateStore()
  return (
    <ButtonComponent
      item_key="ModalUpload"
      text="Choose Image"
      func={() => {
        setInputModalOpen(true)
      }}
      Icon={CloudUpload}
      disabled={running}
      sx={modalButtonSx}
      color={'primary'}
    />
  )
}

interface DownloadProps {
  sx?: SxProps<Theme> | undefined
}

const DownloadImage = ({ sx = modalButtonSx }: DownloadProps) => {
  const { outputURI, fileName, hasntRun } = useImageStore()

  if (outputURI != null) {
    return (
      <ButtonComponent
        item_key={'DownloadImage'}
        text={'Download'}
        func={() => {
          if (outputURI != null) {
            downloadImage(fileName, outputURI)
          }
        }}
        Icon={CloudDownload}
        disabled={hasntRun}
        sx={sx}
        color={'primary'}
      />
    )
  } else {
    return <></>
  }
}
const CopyImage = () => {
  const { outputURI, hasntRun } = useImageStore()
  if (outputURI != null) {
    return (
      <ButtonComponent
        item_key={'Copy'}
        text={'Copy to Clipboard'}
        func={() => {
          if (outputURI != null) {
            copyImg(outputURI)
          }
        }}
        Icon={CopyAll}
        disabled={hasntRun}
        sx={modalButtonSx}
        color={'primary'}
      />
    )
  } else {
    return <></>
  }
}
const RunModel = () => {
  const { setOutputURI, setUpscaleFactor, setTags, inputURI, upscaleFactor, outputURI } = useImageStore()
  const { setDownloadReady, setRunning, setErrorMessage, running } = useAppStateStore()
  if (outputURI == null) {
    return (
      <ButtonComponent
        item_key="RunComponent"
        text="Run"
        func={() => {
          pipeline(
            setOutputURI,
            setUpscaleFactor,
            setTags,
            inputURI,
            upscaleFactor,
            setDownloadReady,
            setRunning,
            setErrorMessage,
          )
        }}
        Icon={RunCircle}
        disabled={running}
        sx={modalButtonSx}
        color={'primary'}
      />
    )
  } else {
    return <></>
  }
}
const UpscaleFactor = () => {
  const { setUpscaleFactor, upscaleFactor, outputURI } = useImageStore()
  const { running } = useAppStateStore()
  if (outputURI == null) {
    return (
      <FormControl key={'UpscaleFactor'} fullWidth>
        <InputLabel>Factor</InputLabel>
        <Select
          disabled={running}
          value={upscaleFactor.toString()}
          color="primary"
          label={'Upscale Factor'}
          onChange={(e: SelectChangeEvent) => {
            console.log(e.target.value)
            console.log(upscaleFactor)
            setUpscaleFactor(parseInt(e.target.value))
          }}
        >
          <MenuItem value={1}>2</MenuItem>
          <MenuItem value={2}>4</MenuItem>
          <MenuItem value={4}>8</MenuItem>
        </Select>
      </FormControl>
    )
  } else {
    return <></>
  }
}

const PresetSelect = () => {
  const { setInputURI } = useImageStore()
  const { selectedPreset, setSelectedPreset } = useAppStateStore()

  return (
    <FormControl color="success" sx={{ minWidth: 200, marginBottom: 2 }} fullWidth>
      <InputLabel>Preset</InputLabel>
      <Select
        color="success"
        value={selectedPreset}
        label="Preset"
        onChange={(inp) => {
          setSelectedPreset(inp.target.value)
          const [name, url] = inp.target.value.split('|')
          setInputURI(url)
        }}
      >
        {preset_list.map((preset, i) => (
          <MenuItem color="success" value={`${preset.name}|${preset.url}`} key={i}>
            {preset.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const ImageUpload = () => {
  const { setInputURI } = useImageStore()
  const { setSelectedPreset } = useAppStateStore()

  return (
    <Button
      component="label"
      key="ModalUpload"
      variant="contained"
      size="large"
      sx={{ color: '#fff', marginRight: 2 }}
      color="success"
    >
      <input
        type="file"
        hidden
        accept="image/*"
        onInput={(e) => {
          let inp = e.target as HTMLInputElement
          if (inp.files && inp.files[0]) {
            setInputURI(inp.files[0])
            setSelectedPreset('')
          }
        }}
      />
      Upload
    </Button>
  )
}

const ModalDone = () => {
  const { inputURI, setInputURI, setTags } = useImageStore()
  const { setSelectedPreset, setInputModalOpen } = useAppStateStore()

  return (
    <ButtonComponent
      item_key="ModalDone"
      func={() => {
        setInputURI(inputURI)
        setTags(getEmptyTags())
        setInputModalOpen(false)
        setSelectedPreset('')
      }}
      // variant="outlined"
      sx={{ float: 'right', marginLeft: 2 }}
      color="success"
      text="Done"
      disabled={false}
      Icon={Done}
    />
  )
}

async function copyImg(src: string) {
  const img = await fetch(src)
  const imgBlob = await img.blob()
  try {
    navigator.clipboard.write([
      new ClipboardItem({
        'image/png': imgBlob, // change image type accordingly
      }),
    ])
  } catch (error) {
    console.error(error)
  }
}

async function pipeline(
  setOutputURI: (uri: string) => void,
  setUpscaleFactor: (factor: number) => void,
  setTags: (tags: any) => void,
  inputURI: string,
  upscaleFactor: number,
  setDownloadReady: (ready: boolean) => void,
  setRunning: (running: boolean) => void,
  setErrorMessage: (message: string) => void,
) {
  try {
    setRunning(true)

    try {
      const result = await upScaleFromURI(setTags, inputURI, upscaleFactor)
      if (result != null) {
        setOutputURI(result)
      }
    } catch (error) {
      setErrorMessage('Failed to upscale image.')
    } finally {
      setDownloadReady(true)
      setRunning(false)
      setUpscaleFactor(1)
    }
  } catch (error) {
    setErrorMessage('Could not load model.')
  }
}

export { ModalUpload, DownloadImage, CopyImage, RunModel, UpscaleFactor, ModalDone, PresetSelect, ImageUpload }
