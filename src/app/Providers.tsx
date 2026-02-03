'use client'

import { ReactNode, useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { THEME_COLORS } from '@/constants'

interface ProvidersProps {
  children: ReactNode
  fontFamily: string
}

export default function Providers({ children, fontFamily }: ProvidersProps) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: THEME_COLORS.primary },
          secondary: { main: THEME_COLORS.secondary },
          success: { main: THEME_COLORS.success },
          donation: {
            main: THEME_COLORS.donationButton,
            dark: THEME_COLORS.donationButtonHover,
            contrastText: '#fff',
          },
        },
        typography: {
          fontFamily,
          h2: {
            fontWeight: 'bold',
          },
        },
        spacing: 8, // Standard 8px spacing unit
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
          },
        },
        components: {
          MuiAlert: {
            styleOverrides: {
              root: ({ ownerState }) => ({
                ...(ownerState.severity === 'info' && {
                  backgroundColor: THEME_COLORS.alertInfo,
                }),
              }),
            },
          },
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
              },
            },
          },
          MuiContainer: {
            defaultProps: {
              maxWidth: 'lg',
            },
          },
        },
      }),
    [fontFamily]
  )

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
