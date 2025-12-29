import { UI_CONFIG } from '@/constants'

// Shared grid column configuration to ensure alignment between titlebar and main content
export const GRID_COLUMNS = {
  mobile: '1fr',
  tablet: '280px 1fr',
  desktop: '320px 1fr 300px',
  largeDesktop: '320px 1fr 400px',
} as const

export const getGridTemplateColumns = (isMobile: boolean) => ({
  xs: '1fr',
  md: isMobile ? '1fr' : GRID_COLUMNS.tablet,
  lg: isMobile ? '1fr' : GRID_COLUMNS.desktop,
  xl: isMobile ? '1fr' : GRID_COLUMNS.largeDesktop,
})

export const SIDEBAR_WIDTH = UI_CONFIG.layout.sidebarWidth
export const APP_BAR_HEIGHT = UI_CONFIG.layout.appBarHeight
export const DRAWER_WIDTH = UI_CONFIG.layout.drawerWidth
