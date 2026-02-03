'use client'

import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { Titlebar } from './Titlebar'
import { ASSETS, RESPONSIVE } from '@/constants'

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

export function PageLayout({ children, maxWidth = 'md' }: PageLayoutProps) {
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <Box>
        <Titlebar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          background: `url(${ASSETS.mobileBg}) bottom center / contain no-repeat`,
          backgroundSize: { xs: 'cover', sm: 'contain' },
          display: 'grid',
          gridTemplateColumns: RESPONSIVE.pageGridColumns,
        }}
      >
        <Box sx={{ gridColumn: { xs: 1, md: 2, lg: 2 }, display: { xs: 'none', md: 'block' } }} />

        <Container
          maxWidth={maxWidth}
          sx={{
            gridColumn: {
              xs: 1,
              md: 2,
              lg: 2,
            },
          }}
        >
          {children}
        </Container>

        <Box sx={{ gridColumn: { lg: 3, xl: 3 }, display: { xs: 'none', lg: 'block' } }} />
      </Box>
    </Stack>
  )
}
