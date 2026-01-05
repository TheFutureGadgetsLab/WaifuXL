import { GRID_COLUMNS, UI_CONFIG } from '@/constants'

export const getGridTemplateColumns = (isMobile: boolean) => ({
  xs: GRID_COLUMNS.mobile,
  md: isMobile ? GRID_COLUMNS.mobile : GRID_COLUMNS.tablet,
  lg: isMobile ? GRID_COLUMNS.mobile : GRID_COLUMNS.desktop,
  xl: isMobile ? GRID_COLUMNS.mobile : GRID_COLUMNS.largeDesktop,
})

export const SIDEBAR_WIDTH = UI_CONFIG.layout.sidebarWidth
export const APP_BAR_HEIGHT = UI_CONFIG.layout.appBarHeight
export const DRAWER_WIDTH = UI_CONFIG.layout.drawerWidth
