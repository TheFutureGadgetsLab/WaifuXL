'use client'

import { useEffect, useState } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

import ImageModal from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleBar from '@/components/titlebar'
import { UI_CONFIG, STYLES } from '@/constants'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { useEventHandlers } from '@/services/windowUtilities'

const styles = {
  main: {
    ...STYLES.flexColumn,
    height: '100vh',
  },
  contentGrid: {
    height: UI_CONFIG.layout.contentHeight,
    marginTop: 4,
    background: 'url(/DesktopBG.svg) bottom right / contain no-repeat',
  },
  container: {
    ...STYLES.flexColumn,
    height: '100%',
    justifyContent: 'center',
  },
  imageBox: {
    width: '100%',
    maxWidth: UI_CONFIG.layout.maxImageWidth,
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '100%',
  },
  slider: {
    ...STYLES.absolutePosition,
    ...STYLES.fullSize,
  },
  image: {
    objectFit: 'contain' as const,
    ...STYLES.fullSize,
  },
} as const

const HomePage = () => {
  useEventHandlers()

  return (
    <Box sx={styles.main}>
      <TitleBar />
      <MainContent />
      <ImageModal />
    </Box>
  )
}

const MainContent = () => (
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
)

const ImageDisplay = () => {
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

const ProcessingText = () => {
  const [dots, setDots] = useState('')
  const running = useAppStateStore((state) => state.running)
  const outputURI = useImageStore((state) => state.outputURI)

  useEffect(() => {
    if (!running) return
    
    const interval = setInterval(() => {
      setDots((prev) => (prev === '...' ? '' : `${prev}.`))
    }, UI_CONFIG.loadingTextInterval)
    
    return () => clearInterval(interval)
  }, [running])

  const hasProcessed = outputURI !== null
  const displayText = hasProcessed ? 'Download' : running ? 'Expanding' : 'Expand'

  return (
    <Typography variant="h2" color="primary" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
      <Box component="span" sx={{ color: 'black', fontWeight: 'bold' }}>
        {displayText} your{' '}
      </Box>
      waifu
      {running ? dots : '!'}
    </Typography>
  )
}

export default HomePage
