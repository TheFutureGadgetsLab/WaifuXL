'use client'

import { useEffect, useState, memo } from 'react'
import { Box, Stack, Typography, useMediaQuery, useTheme, Drawer, IconButton, Fab } from '@mui/material'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'

import ImageModal from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleBar from '@/components/titlebar'
import { UI_CONFIG } from '@/constants'
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
    <Stack direction="column" sx={{ height: '100vh', overflow: 'hidden' }}>
      <TitleBar isMobile={isMobile} />
      <MainContent isMobile={isMobile} onToggleDrawer={toggleMobileDrawer} />
      <MobileDrawer open={mobileDrawerOpen} onClose={toggleMobileDrawer} />
      <ImageModal />
    </Stack>
  )
}

interface MainContentProps {
  isMobile: boolean
  onToggleDrawer: () => void
}

const MainContent = memo(({ isMobile, onToggleDrawer }: MainContentProps) => {
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.only('md'))

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: 'calc(100vh - 64px)',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: isMobile ? '1fr' : '280px 1fr',
          lg: isMobile ? '1fr' : '320px 1fr 300px',
          xl: isMobile ? '1fr' : '320px 1fr 400px',
        },
        gridTemplateRows: '1fr',
        position: 'relative',
      }}
    >
      {!isMobile && (
        <Box sx={{ gridColumn: 1 }}>
          <Sidebar />
        </Box>
      )}

      <Box
        sx={{
          gridColumn: {
            xs: 1,
            md: isMobile ? 1 : 2,
            lg: isMobile ? 1 : 2,
          },
          position: 'relative',
          p: { xs: 1, sm: 2, md: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ImageDisplay />
        <MobileMenuButton isMobile={isMobile} onToggleDrawer={onToggleDrawer} />
      </Box>

      {!isMobile && isLargeScreen && (
        <Box
          sx={{
            gridColumn: 3,
            background: 'url(/DesktopBG.svg) bottom right / contain no-repeat',
            pointerEvents: 'none',
          }}
        />
      )}

      {!isMobile && isMediumScreen && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '250px',
            height: '100%',
            background: 'url(/DesktopBG.svg) bottom right / contain no-repeat',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
    </Box>
  )
})

MainContent.displayName = 'MainContent'

const ImageDisplay = memo(() => {
  const { inputURI, outputURI } = useImageStore()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: { xs: '95vw', sm: '80vw', md: '70vw', lg: '65vw' },
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 'fit-content',
          minWidth: { xs: '350px', sm: '500px', md: '650px' },
          minHeight: { xs: '260px', sm: '375px', md: '490px' },
          maxHeight: { xs: '70vh', sm: '75vh', md: '80vh' },
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'hidden',
          boxShadow: inputURI ? 3 : 1,
          transition: 'box-shadow 0.3s ease-in-out',
          mb: 2,
          '& .react-compare-slider': {
            minWidth: 'inherit',
            minHeight: 'inherit',
            maxHeight: 'inherit',
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
                display: 'block',
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
                  display: 'block',
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

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

const MobileDrawer = memo(({ open, onClose }: MobileDrawerProps) => (
  <Drawer
    variant="temporary"
    anchor="left"
    open={open}
    onClose={onClose}
    ModalProps={{
      keepMounted: true,
    }}
    sx={{
      '& .MuiDrawer-paper': {
        width: UI_CONFIG.layout.drawerWidth,
        boxSizing: 'border-box',
      },
    }}
  >
    <Stack direction="row" justifyContent="flex-end" sx={{ p: 1 }}>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
    <Sidebar isMobile />
  </Drawer>
))

MobileDrawer.displayName = 'MobileDrawer'

interface MobileMenuButtonProps {
  isMobile: boolean
  onToggleDrawer: () => void
}

const MobileMenuButton = memo(({ isMobile, onToggleDrawer }: MobileMenuButtonProps) =>
  isMobile ? (
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
  ) : null
)

MobileMenuButton.displayName = 'MobileMenuButton'

export default HomePage
