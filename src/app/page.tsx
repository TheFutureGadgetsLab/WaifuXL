'use client'

import { Box, Container, Typography } from '@mui/material'

import ModalComponent from '@/components/modal'
import Sidebar from '@/components/sidebar'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { registerEventHandlers } from '@/services/windowUtilities'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ReactCompareSlider } from 'react-compare-slider'

export default function HomePage() {
  registerEventHandlers()

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Sidebar />
        <ImageDisplayComponent />
        <ProcessingTextComponent />
        <ModalComponent />
      </Box>
    </Container>
  )
}

function ImageDisplayComponent() {
  const { inputURI, outputURI } = useImageStore()
  return (
    <>
      {outputURI == null ? (
        <Image src={inputURI} width="500" height="500" alt="base image" priority={true} />
      ) : (
        <ReactCompareSlider
          itemOne={<Image src={inputURI} width="500" height="500" alt="before image" priority={true} />}
          itemTwo={<Image src={outputURI} width="500" height="500" alt="after image" priority={true} />}
        />
      )}
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

  // Determine the display text based on app state
  const displayText = downloadReady ? 'Download' : running ? 'Expanding' : 'Expand'

  return (
    <Typography
      sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
      variant="h2"
      color="primary"
      paragraph
    >
      <span style={textStyle}>{displayText} your </span>
      waifu
      {running ? loadingText : '!'}
    </Typography>
  )
}
