'use client'

import { memo } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { ActionButtons } from './ActionButtons'
import { FactorSelector } from './FactorSelector'
import { TagDisplay } from './TagDisplay'
import { SIDEBAR_WIDTH, APP_BAR_HEIGHT } from '@/components/layout'

interface SidebarProps {
  isMobile?: boolean
  onOpenModal: () => void
}

export const Sidebar = memo(function Sidebar({ isMobile = false, onOpenModal }: SidebarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100vh' : `calc(100vh - ${APP_BAR_HEIGHT.xs}px)`,
        '@media (min-width: 600px)': {
          height: isMobile ? '100vh' : `calc(100vh - ${APP_BAR_HEIGHT.sm}px)`,
        },
        width: isMobile ? '100%' : SIDEBAR_WIDTH,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="column"
        sx={{
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Mobile header */}
        {isMobile && (
          <Typography
            variant="h6"
            color="primary"
            sx={{
              textAlign: 'center',
              mb: 2,
              mt: 1,
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            WaifuXL Controls
          </Typography>
        )}

        {/* Action buttons and factor selector */}
        <Container
          sx={{
            mt: isMobile ? 0 : 2,
            px: { xs: 2, sm: 3 },
            flexShrink: 0,
          }}
        >
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            <ActionButtons onOpenModal={onOpenModal} />
            <FactorSelector />
          </Stack>
        </Container>

        {/* Tag display */}
        <TagDisplay />
      </Stack>
    </Box>
  )
})

Sidebar.displayName = 'Sidebar'
