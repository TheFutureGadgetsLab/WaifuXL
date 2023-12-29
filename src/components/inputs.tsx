import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { downloadImage } from '@/services/imageUtilities'
import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { initializeONNX, upScaleFromURI } from '@/services/inference/utils'
import ButtonComponent from './button'
import { ReactNode } from 'react'
import { text } from 'stream/consumers'

const ModalUpload = () => {
  const { setOutputURI, setUpscaleFactor, setTags, inputURI, extension, upscaleFactor, outputURI, fileName, hasntRun } =
    useImageStore()
  const { setDownloadReady, setRunning, setErrorMessage, running, setInputModalOpen } = useAppStateStore()
  return (
    <ButtonComponent
      item_key="ModalUpload"
      text="Choose Image / GIF"
      func={() => {
        setInputModalOpen(true)
      }}
      Icon={CloudUpload}
      disabled={running}
    />
  )
}
const DownloadImage = () => {
  const { extension, outputURI, fileName, hasntRun } = useImageStore()

  if (outputURI != null) {
    return (
      <ButtonComponent
        item_key={'DownloadImage'}
        text={'Download'}
        func={() => {
          if (outputURI != null) {
            downloadImage(fileName, extension, outputURI)
          }
        }}
        Icon={CloudDownload}
        disabled={hasntRun}
      />
    )
  } else {
    return <></>
  }
}
const CopyImage = () => {
  const { extension, outputURI, hasntRun } = useImageStore()
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
        disabled={hasntRun || extension == 'gif'}
      />
    )
  } else {
    return <></>
  }
}
const RunModel = () => {
  const { setOutputURI, setUpscaleFactor, setTags, inputURI, extension, upscaleFactor, outputURI, fileName, hasntRun } =
    useImageStore()
  const { setDownloadReady, setRunning, setErrorMessage, running, setInputModalOpen } = useAppStateStore()
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
            extension,
            upscaleFactor,
            setDownloadReady,
            setRunning,
            setErrorMessage,
          )
        }}
        Icon={RunCircle}
        disabled={running}
      />
    )
  } else {
    return <></>
  }
}
const UpscaleFactor = () => {
  const { setOutputURI, setUpscaleFactor, setTags, inputURI, extension, upscaleFactor, outputURI, fileName, hasntRun } =
    useImageStore()
  const { setDownloadReady, setRunning, setErrorMessage, running, setInputModalOpen } = useAppStateStore()
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
  extension: string,
  upscaleFactor: number,
  setDownloadReady: (ready: boolean) => void,
  setRunning: (running: boolean) => void,
  setErrorMessage: (message: string) => void,
) {
  try {
    await initializeONNX()
    setRunning(true)

    try {
      const result = await upScaleFromURI(extension, setTags, inputURI, upscaleFactor)
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

export { ModalUpload, DownloadImage, CopyImage, RunModel, UpscaleFactor }
