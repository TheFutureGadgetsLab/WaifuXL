'use client'

import { memo, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

import { Titlebar, MainGrid, DRAWER_WIDTH } from '@/components/layout'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { ImageModal } from '@/components/modal/ImageModal'
import { ImageComparison, ProcessingText } from '@/components/display'
import { ErrorToast } from '@/components/feedback'
import { useResponsive, useReducedMotion } from '@/hooks'
import { useProcessingStore } from '@/services/stores'
import { useEventHandlers } from '@/services/windowUtilities'
import { ASSETS, STYLES } from '@/constants'

export default function HomePage() {
  // Modal and drawer state (local to page)
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Responsive state
  const { isMobile } = useResponsive()

  // Register paste/drag-drop handlers
  useEventHandlers()

  // Handlers
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])
  const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <Stack direction="column" sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Title bar */}
      <Titlebar />

      {/* Main content grid */}
      <MainGrid
        sidebar={<Sidebar onOpenModal={openModal} />}
        content={<MainContent />}
        rightPanel={<BackgroundImage />}
      />

      {/* Mobile drawer */}
      {isMobile && (
        <MobileDrawer open={drawerOpen} onClose={closeDrawer} onOpenModal={openModal} />
      )}

      {/* Mobile menu FAB */}
      {isMobile && (
        <MobileMenuButton onClick={toggleDrawer} drawerOpen={drawerOpen} />
      )}

      {/* Image selection modal */}
      <ImageModal open={modalOpen} onClose={closeModal} />

      {/* Error toast */}
      <ErrorToast />
    </Stack>
  )
}

// Main content area with image comparison and text
const MainContent = memo(function MainContent() {
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
      <ImageComparison />
      <ProcessingText />
    </Box>
  )
})

MainContent.displayName = 'MainContent'

// Background image for right panel (desktop only)
const BackgroundImage = memo(function BackgroundImage() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: `url(${ASSETS.desktopBg}) bottom right / contain no-repeat`,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
})

BackgroundImage.displayName = 'BackgroundImage'

// Mobile drawer with sidebar
interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  onOpenModal: () => void
}

const MobileDrawer = memo(function MobileDrawer({ open, onClose, onOpenModal }: MobileDrawerProps) {
  return (
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
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Stack direction="row" justifyContent="flex-end" sx={{ p: 1 }}>
        <IconButton onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </IconButton>
      </Stack>
      <Sidebar isMobile onOpenModal={onOpenModal} />
    </Drawer>
  )
})

MobileDrawer.displayName = 'MobileDrawer'

// Mobile menu FAB
interface MobileMenuButtonProps {
  onClick: () => void
  drawerOpen: boolean
}

const MobileMenuButton = memo(function MobileMenuButton({ onClick, drawerOpen }: MobileMenuButtonProps) {
  const status = useProcessingStore((state) => state.status)
  const prefersReducedMotion = useReducedMotion()

  // Flash when processing just completed and drawer is closed
  const showFlash = status === 'complete' && !drawerOpen && !prefersReducedMotion

  return (
    <Fab
      color="primary"
      aria-label="Open menu"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        zIndex: (theme) => theme.zIndex.speedDial,
        ...(showFlash && STYLES.flashAnimation),
      }}
    >
      <MenuIcon />
    </Fab>
  )
})

MobileMenuButton.displayName = 'MobileMenuButton'
