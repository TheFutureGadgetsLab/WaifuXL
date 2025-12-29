'use client'

import { ReactNode } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Titlebar } from './Titlebar'
import { ASSETS, RESPONSIVE } from '@/constants'

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

export function PageLayout({ children, maxWidth = 'md' }: PageLayoutProps) {
  return (
    <Grid container direction="column" sx={{ minHeight: '100vh' }}>
      <Grid>
        <Titlebar />
      </Grid>
      <Grid
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
      </Grid>
    </Grid>
  )
}
