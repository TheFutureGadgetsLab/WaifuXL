'use client'

import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import { initializeONNX, upScaleFromURI } from '@/services/inference/utils'
import { useAppStateStore, useImageStore } from '../services/useState'

import Drawer from '@mui/material/Drawer'
import { TagDisplayComponent } from '@/components/tagDisplay'
import { downloadImage } from '@/services/imageUtilities'
import ButtonsComponent from './buttons'

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
  const { setDownloadReady, setRunning, setErrorMessage, setLoadProg, running, loadProg, setInputModalOpen } =
    useAppStateStore()

  const modelLoading = loadProg >= 0

  const sidebarButtons = [
    {
      key: 'ModalUpload',
      text: 'Choose Image / GIF',
      func: () => {
        setInputModalOpen(true)
      },
      icon: CloudUpload,
      display: true,
      disabled: running,
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
    },
    {
      key: 'RunComponent',
      text: 'Run',
      func: () => {
        setLoadProg(0)
        initializeONNX(setLoadProg)
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
                setUpscaleFactor(2)
              })
          })
          .catch(() => {
            setErrorMessage('Could not load model.')
          })
          .finally(() => {
            setLoadProg(-1)
          })
      },
      icon: RunCircle,
      display: outputURI == null,
      disabled: modelLoading || running,
    },
    {
      key: 'UpscaleFactor',
      text: 'Upscale Factor',
      func: () => {},
      icon: CopyAll,
      display: outputURI == null,
      disabled: running,
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
      <ButtonsComponent buttonSpecs={sidebarButtons} />
      {tags != null ? (
        <>
          <TagDisplayComponent title={'Top Chars'} index={'topChars'} />
          <TagDisplayComponent title={'Top Desc'} index={'topDesc'} />
          <TagDisplayComponent title={'Explicitness'} index={'rating'} />
        </>
      ) : (
        <></>
      )}
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
