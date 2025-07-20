'use client'

import { useEffect, useState } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

import ImageModal from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleBar from '@/components/titlebar'
import { LAYOUT, ANIMATION } from '@/constants'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { useEventHandlers } from '@/services/windowUtilities'

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  contentGrid: {
    height: LAYOUT.contentHeight,
    marginTop: 4,
    background: 'url(/DesktopBG.svg) bottom right / contain no-repeat',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageBox: {
    width: '100%',
    maxWidth: LAYOUT.maxImageWidth,
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '100%',
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  image: {
    objectFit: 'contain' as const,
    width: '100%',
    height: '100%',
  },
} as const

function HomePage() {
  useEventHandlers()

  return (
    <Box sx={styles.main}>
      <TitleBar />
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid>
          <Sidebar />
        </Grid>
        <Grid size="grow" sx={styles.contentGrid}>
          <Container sx={styles.container}>
            <ImageDisplay />
          </Container>
        </Grid>
      </Grid>
      <ImageModal />
    </Box>
  )
}

function ImageDisplay() {
  const { inputURI, outputURI } = useImageStore()

  return (
    <Box sx={styles.imageBox}>
      <Box sx={styles.imageContainer}>
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src={inputURI} alt="Before image" style={styles.image} />}
          itemTwo={
            outputURI ? <ReactCompareSliderImage src={outputURI} alt="After image" style={styles.image} /> : null
          }
          handle={outputURI ? undefined : <></>}
          style={styles.slider}
        />
      </Box>
      <ProcessingText />
    </Box>
  )
}

function ProcessingText() {
  const [loadingText, setLoadingText] = useState('')
  const { running, downloadReady } = useAppStateStore()

  useEffect(() => {
    const updateLoadingText = () => {
      setLoadingText((prev) => (prev === '...' ? '' : `${prev}.`))
    }

    const interval = setInterval(updateLoadingText, ANIMATION.loadingTextInterval)
    return () => clearInterval(interval)
  }, [])

  const displayText = downloadReady ? 'Download' : running ? 'Expanding' : 'Expand'

  return (
    <Typography variant="h2" color="primary" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
      <Box component="span" sx={{ color: 'black', fontWeight: 'bold' }}>
        {displayText} your{' '}
      </Box>
      waifu
      {running ? loadingText : '!'}
    </Typography>
  )
}

export default HomePage
