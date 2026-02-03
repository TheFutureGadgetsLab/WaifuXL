'use client'

import { memo, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { GRID_COLUMNS } from '@/constants'
import { APP_BAR_HEIGHT } from './gridConfig'

interface MainGridProps {
  sidebar?: ReactNode
  content: ReactNode
  rightPanel?: ReactNode
}

export const MainGrid = memo(function MainGrid({ sidebar, content, rightPanel }: MainGridProps) {
  return (
    <Box
      component="main"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: GRID_COLUMNS.mobile,
          md: GRID_COLUMNS.tablet,
          lg: GRID_COLUMNS.desktop,
          xl: GRID_COLUMNS.largeDesktop,
        },
        minHeight: {
          xs: `calc(100vh - ${APP_BAR_HEIGHT.xs}px)`,
          sm: `calc(100vh - ${APP_BAR_HEIGHT.sm}px)`,
        },
      }}
    >
      {/* Left sidebar */}
      {sidebar && (
        <Box
          component="aside"
          role="complementary"
          aria-label="Controls and settings"
          sx={{
            gridColumn: 1,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
          }}
        >
          {sidebar}
        </Box>
      )}

      {/* Main content */}
      <Box
        sx={{
          gridColumn: {
            xs: 1,
            md: 2,
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {content}
      </Box>

      {/* Right panel (large screens only) */}
      {rightPanel && (
        <Box
          sx={{
            gridColumn: 3,
            position: 'relative',
            overflow: 'hidden',
            display: { xs: 'none', lg: 'block' },
          }}
        >
          {rightPanel}
        </Box>
      )}
    </Box>
  )
})

MainGrid.displayName = 'MainGrid'
