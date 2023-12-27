'use client';
import * as React from 'react'

import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import Link from 'next/link'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useAppStateStore, useImageStore } from '../services/useState'
import { initializeONNX, upScaleFromURI } from '@/services/inference/utils'
import { downloadImage } from '@/services/imageUtilities'
import { TagDisplayComponent } from '@/components/tagDisplay';


const DRAWER_WIDTH = 300

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, overflow: 'hidden' }}>
        <ThemeRegistry>
          <HeaderBar />
          <Box
            component="main"
            sx={{
              height: '100%',
              bgcolor: 'background.default',
              mt: ['48px', '56px', '64px'],
              p: 3,
              backgroundImage: 'url(/DesktopBG.svg)',
              backgroundPosition: 'bottom right',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }}
          >
            <SideBar />
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  )
}

function HeaderBar() {
  const HEADER_LINKS = [
    { text: 'About', href: '/about', weight: 450, color: 'text.primary' },
    { text: 'WaifuXL', href: '/', weight: 600, color: 'secondary.main' },
    { text: 'Donate', href: '/donate', weight: 450, color: 'text.primary' },
  ]

  return (
    <AppBar sx={{ zIndex: 0, boxShadow: 'none' }} color="primary">
      <Toolbar
        sx={{
          justifyContent: 'center',
        }}
      >
        {HEADER_LINKS.map((link) => (
          <Link href={link.href} key={link.text} passHref>
            <Button color="inherit">
              <Typography
                variant="h4"
                color={link.color}
                sx={{
                  fontWeight: link.weight,
                  textTransform: 'none',
                }}
              >
                {link.text}
              </Typography>
            </Button>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  )
}

function SideBar() {
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
