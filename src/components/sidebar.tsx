'use client';
import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import Drawer from '@mui/material/Drawer'
import { useAppStateStore, useImageStore } from '../services/useState'
import { initializeONNX, upScaleFromURI } from '@/services/inference/utils'
import { downloadImage } from '@/services/imageUtilities'
import { TagDisplayComponent } from '@/components/tagDisplay';
import { Button } from '@mui/material';

const DRAWER_WIDTH = 300

export default function SideBarComponent() {
    const { setOutputURI, setUpscaleFactor, setTags, inputURI, extension, upscaleFactor, outputURI, fileName, hasntRun, tags } = useImageStore()
    const { setDownloadReady, setRunning, setErrorMessage, setLoadProg, running, loadProg, setInputModalOpen } = useAppStateStore()
  
    const modelLoading = loadProg >= 0
  
    const SIDEBAR_LINKS = [
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
          downloadImage(fileName, extension, outputURI)
        }, 
        icon: CloudDownload,
        display: outputURI != null,
        disabled: hasntRun
      },
      //TODO: Replace this with a copy to clipboard option
      // { 
      //   key: 'ImgurPost',
      //   text: 'Post To Imgur', 
      //   func: () => { }, 
      //   icon: CopyAll,
      //   display: outputURI != null
      // },
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
                  setOutputURI(result)
                  // incrementCounter()
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
        disabled: modelLoading || running
      },
      {
        key: 'UpscaleFactor',
        text: 'Upscale Factor',
        func: () => { },
        icon: CopyAll,
        display: outputURI == null,
        disabled: running
      }
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
        {SIDEBAR_LINKS.filter((info) => info.display).map(({ key, text, func, icon: Icon, display, disabled }) => (
          <Button
            key={key}
            onClick={func}
            disabled={disabled}
            variant="contained"
            size="large"
            sx={{
              justifyContent: 'flex-start',
              marginBottom: 2,
              ':not(:last-child)': {
                marginBottom: 1,
              },
              color: 'secondary.main',
            }}
            startIcon={<Icon />}
            color="primary"
          >
            {text}
          </Button>
        ))}
        {
          tags != null ? 
          <>
            <TagDisplayComponent title={"Top Chars"} index={"topChars"}/>
            <TagDisplayComponent title={"Top Desc"} index={"topDesc"}/>
            <TagDisplayComponent title={"Explicitness"} index={"rating"}/>
          </>
          : <></>
        }
        
      </Drawer>
    )
  }