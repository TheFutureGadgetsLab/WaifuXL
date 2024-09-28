'use client'

import { AppBar, Box, Button, Container, ThemeProvider, Toolbar, Typography } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { Roboto } from 'next/font/google'
import Link from 'next/link'
import * as React from 'react'

const HEADER_LINKS = [
  { text: 'About', href: '/about', weight: 450, color: 'text.primary' },
  { text: 'WaifuXL', href: '/', weight: 600, color: 'secondary.main' },
  { text: 'Donate', href: '/donate', weight: 450, color: 'text.primary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider theme={theme}>
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar sx={{ justifyContent: 'center' }}>
              {HEADER_LINKS.map((link) => (
                <Link href={link.href} key={link.text} passHref>
                  <Button color="inherit">
                    <Typography variant="h6" color={link.color} sx={{ fontWeight: link.weight, textTransform: 'none' }}>
                      {link.text}
                    </Typography>
                  </Button>
                </Link>
              ))}
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundImage: 'url(/DesktopBG.svg)',
              backgroundPosition: 'bottom right',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              padding: 3,
            }}
          >
            <Container>{children}</Container>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  )
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF869C',
    },
    secondary: {
      main: '#FFFFFF',
    },
    success: {
      main: '#44ABBC',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
})
