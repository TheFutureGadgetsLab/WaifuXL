'use client'

import { memo } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import { HEADER_LINKS } from '@/constants'
import { useResponsive } from '@/hooks'
import { getGridTemplateColumns, APP_BAR_HEIGHT } from './gridConfig'

export const Titlebar = memo(function Titlebar() {
  const { isMobile, isDesktop } = useResponsive()

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={0}
      sx={{
        minHeight: APP_BAR_HEIGHT,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: getGridTemplateColumns(isMobile),
          minHeight: APP_BAR_HEIGHT,
        }}
      >
        {/* Left spacer for sidebar alignment */}
        {!isMobile && <Box sx={{ gridColumn: 1 }} />}

        {/* Navigation links */}
        <Toolbar
          sx={{
            gridColumn: {
              xs: 1,
              md: isMobile ? 1 : 2,
            },
            justifyContent: 'center',
            minHeight: APP_BAR_HEIGHT,
            px: { xs: 1, sm: 2 },
          }}
        >
          {HEADER_LINKS.map(({ text, href, weight, color }) => (
            <Button
              key={text}
              component={Link}
              href={href}
              color="inherit"
              sx={{
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              <Typography
                variant="h4"
                color={color}
                sx={{
                  fontWeight: weight,
                  textTransform: 'none',
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                }}
              >
                {text}
              </Typography>
            </Button>
          ))}
        </Toolbar>

        {/* Right spacer for large screens */}
        {!isMobile && isDesktop && <Box sx={{ gridColumn: 3 }} />}
      </Box>
    </AppBar>
  )
})

Titlebar.displayName = 'Titlebar'
