'use client'

import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import { initializeONNX, upScaleFromURI } from '@/services/inference/utils'
import { useAppStateStore, useImageStore } from '../services/useState'

import ButtonsComponent from './inputs'
import Drawer from '@mui/material/Drawer'
import { SelectChangeEvent } from '@mui/material'
import { TagDisplayComponent } from '@/components/tagDisplay'
import { downloadImage } from '@/services/imageUtilities'

const DRAWER_WIDTH = 300

export default function SideBarComponent() {
  const {
    setOutputURI,
    setUpscaleFactor,
    setTags,
    inputURI,
    extension,
    upscaleFactor,
    outputURI,
    fileName,
    hasntRun,
    tags,
  } = useImageStore()
  const { setDownloadReady, setRunning, setErrorMessage, running, setInputModalOpen } = useAppStateStore()

  const sidebarContent = [
    {
      key: 'ModalUpload',
      text: 'Choose Image / GIF',
      func: () => {
        setInputModalOpen(true)
      },
      icon: CloudUpload,
      display: true,
      disabled: running,
      type: 'button',
      current: undefined,
    },
    {
      key: 'DownloadImage',
      text: 'Download',
      func: () => {
        if (outputURI != null) {
          downloadImage(fileName, extension, outputURI)
        }
      },
      icon: CloudDownload,
      display: outputURI != null,
      disabled: hasntRun,
      type: 'button',
      current: undefined,
    },
    {
      key: 'Copy',
      text: 'Copy to Clipboard',
      func: () => {
        if (outputURI != null) {
          copyImg(outputURI)
        }
      },
      icon: CopyAll,
      display: outputURI != null,
      disabled: hasntRun || extension == 'gif',
      type: 'button',
      current: undefined,
    },
    {
      key: 'RunComponent',
      text: 'Run',
      func: () => {
        initializeONNX()
          .then(() => {
            setRunning(true)
          })
          .then(() => {
            upScaleFromURI(extension, setTags, inputURI, upscaleFactor)
              .then((result) => {
                if (result != null) {
                  setOutputURI(result)
                  // incrementCounter()
                }
              })
              .catch((error) => {
                setErrorMessage(error)
              })
              .finally(() => {
                setDownloadReady(true)
                setRunning(false)
                setUpscaleFactor(1)
              })
          })
          .catch(() => {
            setErrorMessage('Could not load model.')
          })
      },
      icon: RunCircle,
      display: outputURI == null,
      disabled: running,
      type: 'button',
      current: undefined,
    },
    {
      key: 'UpscaleFactor',
      text: 'Upscale Factor',
      func: (e: SelectChangeEvent) => {
        console.log(e.target.value)
        console.log(upscaleFactor)
        setUpscaleFactor(parseInt(e.target.value))
      },
      icon: CopyAll,
      display: outputURI == null,
      disabled: running,
      type: 'selection',
      current: upscaleFactor,
    },
  ]

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: ['48px', '56px', '64px'],
          height: 'auto',
          bottom: 0,
          padding: 2,
          bgcolor: 'primary',
        },
      }}
      open={true}
      variant="persistent"
    >
      <ButtonsComponent buttonSpecs={sidebarContent} />
      <TagDisplayComponent title={'Top Chars'} tags={tags.topChars} />
      <TagDisplayComponent title={'Top Desc'} tags={tags.topDesc} />
      <TagDisplayComponent title={'Explicitness'} tags={tags.rating} />
    </Drawer>
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
