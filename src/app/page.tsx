'use client'

import { useEffect, useState, memo } from 'react'
import { Box, Container, Grid, Typography, useMediaQuery, useTheme, Drawer, IconButton, Fab } from '@mui/material'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'

import ImageModal from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleBar from '@/components/titlebar'
import { UI_CONFIG, STYLES } from '@/constants'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { useEventHandlers } from '@/services/windowUtilities'

const HomePage = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(UI_CONFIG.layout.sidebarBreakpoint))

  useEventHandlers()

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <Box
      sx={{
        ...STYLES.flexColumn,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <TitleBar />
      <MainContent isMobile={isMobile} onToggleDrawer={toggleMobileDrawer} />

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: UI_CONFIG.layout.drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 1,
            }}
          >
            <IconButton onClick={toggleMobileDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Sidebar isMobile={true} />
        </Drawer>
      )}

      <ImageModal />
    </Box>
  )
}

interface MainContentProps {
  isMobile: boolean
  onToggleDrawer: () => void
}

const MainContent = memo(({ isMobile, onToggleDrawer }: MainContentProps) => (
  <Grid container sx={{ flexGrow: 1, height: UI_CONFIG.layout.contentHeight }}>
    {/* Desktop Sidebar */}
    {!isMobile && (
      <Grid size="auto">
        <Sidebar />
      </Grid>
    )}

    {/* Main Content Area */}
    <Grid
      size="grow"
      sx={{
        position: 'relative',
        background: {
          xs: 'none',
          md: 'url(/DesktopBG.svg) bottom right / contain no-repeat',
        },
        p: { xs: 1, sm: 2, md: 4 },
        pt: { xs: 1, sm: 2 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          ...STYLES.flexColumn,
          ...STYLES.fullSize,
          justifyContent: 'center',
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <ImageDisplay />
      </Container>

      {/* Mobile Menu Button */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="open menu"
          onClick={onToggleDrawer}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: (theme) => theme.zIndex.speedDial,
          }}
        >
          <MenuIcon />
        </Fab>
      )}
    </Grid>
  </Grid>
))

MainContent.displayName = 'MainContent'

const ImageDisplay = memo(() => {
  const { inputURI, outputURI } = useImageStore()

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: UI_CONFIG.layout.maxImageWidth,
        mx: { xs: 'auto', md: '0' },
        ml: { md: '5%', lg: '8%' },
        height: 'fit-content',
        maxHeight: {
          xs: 'calc(100vh - 200px)',
          sm: 'calc(100vh - 220px)',
          md: 'calc(100vh - 240px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 'fit-content',
          minWidth: { xs: '280px', sm: '320px', md: '400px' },
          maxWidth: '100%',
          height: 'fit-content',
          minHeight: { xs: '200px', sm: '240px', md: '300px' },
          maxHeight: {
            xs: 'calc(100vh - 250px)',
            sm: 'calc(100vh - 280px)',
            md: 'calc(100vh - 300px)',
          },
          mx: 'auto',
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'hidden',
          boxShadow: {
            xs: 1,
            sm: 2,
            md: inputURI ? 3 : 1,
          },
          transition: 'box-shadow 0.3s ease-in-out',
          aspectRatio: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .react-compare-slider': {
            minWidth: { xs: '280px', sm: '320px', md: '400px' },
            minHeight: { xs: '200px', sm: '240px', md: '300px' },
            maxHeight: {
              xs: 'calc(100vh - 250px)',
              sm: 'calc(100vh - 280px)',
              md: 'calc(100vh - 300px)',
            },
          },
        }}
      >
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={inputURI}
              alt="Before image"
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                minWidth: 'inherit',
                minHeight: 'inherit',
              }}
            />
          }
          itemTwo={
            outputURI ? (
              <ReactCompareSliderImage
                src={outputURI}
                alt="After image"
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  minWidth: 'inherit',
                  minHeight: 'inherit',
                }}
              />
            ) : null
          }
          handle={outputURI ? undefined : <></>}
          style={{
            width: '100%',
            height: '100%',
            minWidth: 'inherit',
            minHeight: 'inherit',
          }}
        />
      </Box>
      <ProcessingText />
    </Box>
  )
})

ImageDisplay.displayName = 'ImageDisplay'

const ProcessingText = memo(() => {
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
    <Typography
      variant="h2"
      color="primary"
      align="center"
      sx={{
        mb: { xs: 1, sm: 2 },
        mt: { xs: 2, sm: 3, md: 4 },
        fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
        fontWeight: { xs: 600, sm: 'bold' },
      }}
    >
      <Box component="span" sx={{ color: 'text.primary' }}>
        {displayText} your{' '}
      </Box>
      waifu
      {running ? dots : '!'}
    </Typography>
  )
})

ProcessingText.displayName = 'ProcessingText'

export default HomePage
