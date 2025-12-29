'use client'

import { useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export interface ResponsiveState {
  isMobile: boolean // xs, sm (below md)
  isTablet: boolean // md only
  isDesktop: boolean // lg and above
  isLargeDesktop: boolean // xl and above
}

export function useResponsive(): ResponsiveState {
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.only('md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'))

  return useMemo(
    () => ({ isMobile, isTablet, isDesktop, isLargeDesktop }),
    [isMobile, isTablet, isDesktop, isLargeDesktop]
  )
}
