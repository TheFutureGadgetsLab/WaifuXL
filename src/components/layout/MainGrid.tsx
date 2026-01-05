'use client'

import { memo, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { useResponsive } from '@/hooks'
import { getGridTemplateColumns, APP_BAR_HEIGHT } from './gridConfig'

interface MainGridProps {
  sidebar?: ReactNode
  content: ReactNode
  rightPanel?: ReactNode
}

export const MainGrid = memo(function MainGrid({ sidebar, content, rightPanel }: MainGridProps) {
  const { isMobile, isDesktop } = useResponsive()

  return (
    <Box
      component="main"
      sx={{
        display: 'grid',
        gridTemplateColumns: getGridTemplateColumns(isMobile),
        minHeight: {
          xs: `calc(100vh - ${APP_BAR_HEIGHT.xs}px)`,
          sm: `calc(100vh - ${APP_BAR_HEIGHT.sm}px)`,
        },
      }}
    >
      {/* Left sidebar */}
      {!isMobile && sidebar && (
        <Box
          component="aside"
          role="complementary"
          aria-label="Controls and settings"
          sx={{
            gridColumn: 1,
            display: 'flex',
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
            md: isMobile ? 1 : 2,
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
      {!isMobile && isDesktop && rightPanel && (
        <Box
          sx={{
            gridColumn: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {rightPanel}
        </Box>
      )}
    </Box>
  )
})

MainGrid.displayName = 'MainGrid'
