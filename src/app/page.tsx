'use client'

import { Box, Container, Grid2, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

import ModalComponent from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleBar from '@/components/titlebar'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { registerEventHandlers } from '@/services/windowUtilities'

export default function HomePage() {
  registerEventHandlers()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TitleBar />
      <Grid2 container sx={{ flexGrow: 1 }}>
        <Grid2>
          <Sidebar />
        </Grid2>
        <Grid2
          size={'grow'}
          sx={{ height: '90vh', marginTop: 4, background: 'url(/DesktopBG.svg) bottom right / contain no-repeat' }}
        >
          <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <ImageDisplayComponent />
          </Container>
        </Grid2>
      </Grid2>
      <ModalComponent />
    </Box>
  )
}

function ImageDisplayComponent() {
  const { inputURI, outputURI } = useImageStore()
  return (
    <Box sx={{ width: '100%', maxWidth: '80%' }}>
      <Box sx={{ position: 'relative', paddingTop: '100%' }}>
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={inputURI}
              alt="Before image"
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            />
          }
          itemTwo={
            outputURI ? (
              <ReactCompareSliderImage
                src={outputURI}
                alt="After image"
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            ) : null
          }
          handle={outputURI ? undefined : <></>}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </Box>
      <ProcessingTextComponent />
    </Box>
  )
}

const textStyle = { color: 'black', fontWeight: 'bold' }
function ProcessingTextComponent() {
  const [loadingText, setLoadingText] = useState('')
  const { running, downloadReady } = useAppStateStore()

  useEffect(() => {
    const updateLoadingText = () => {
      setLoadingText((prev) => (prev === '...' ? '' : `${prev}.`))
    }

    const interval = setInterval(updateLoadingText, 750)
    return () => clearInterval(interval)
  }, [])

  const displayText = downloadReady ? 'Download' : running ? 'Expanding' : 'Expand'

  return (
    <Typography sx={{ fontWeight: 'bold' }} variant="h2" color="primary" paragraph align="center">
      <span style={textStyle}>{displayText} your </span>
      waifu
      {running ? loadingText : '!'}
    </Typography>
  )
}
