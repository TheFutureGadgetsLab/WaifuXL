'use client'

import { Box, Container, Grid2, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { ReactCompareSlider } from 'react-compare-slider'

import ModalComponent from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleBar from '@/components/titlebar'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { registerEventHandlers } from '@/services/windowUtilities'
import Image from 'next/image'

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
    <>
      {outputURI == null ? (
        <Image src={inputURI} width={500} height={500} alt="base image" layout="responsive" />
      ) : (
        <ReactCompareSlider
          itemOne={<Image src={inputURI} width={500} height={500} alt="before image" layout="responsive" />}
          itemTwo={<Image src={outputURI} width={500} height={500} alt="after image" layout="responsive" />}
        />
      )}
      <ProcessingTextComponent />
    </>
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
