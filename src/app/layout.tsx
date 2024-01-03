'use client'

import * as React from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import Link from 'next/link'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, overflow: 'hidden' }}>
        <ThemeRegistry>
          <HeaderBar />
          <Box
            component="main"
            sx={{
              height: '100%',
              bgcolor: 'background.default',
              mt: ['48px', '56px', '64px'],
              p: 3,
              backgroundImage: 'url(/DesktopBG.svg)',
              backgroundPosition: 'bottom right',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              display: { xs: 'none', sm: 'block' },
              margin: 0,
              overflow: 'hidden',
            }}
          >
            {children}
          </Box>
          <Box
            component="main"
            sx={{
              bgcolor: 'background.default',
              mt: ['48px', '56px', '64px'],
              p: 3,
              backgroundImage: 'url(/mobileBG.svg)',
              backgroundPosition: 'bottom right',
              backgroundSize: 'auto',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              display: { xs: 'block', sm: 'none' },
              right: 0,
              bottom: 0,
              position: 'fixed',

              top: 0,
              left: 0,

              width: '100%',
              height: '100%',
            }}
          >
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  )
}

function HeaderBar() {
  const HEADER_LINKS = [
    { text: 'About', href: '/about', weight: 450, color: 'text.primary' },
    { text: 'WaifuXL', href: '/', weight: 600, color: 'secondary.main' },
    { text: 'Donate', href: '/donate', weight: 450, color: 'text.primary' },
  ]

  return (
    <AppBar sx={{ zIndex: 0, boxShadow: 'none' }} color="primary">
      <Toolbar
        sx={{
          justifyContent: 'center',
        }}
      >
        {HEADER_LINKS.map((link) => (
          <Link href={link.href} key={link.text} passHref>
            <Button color="inherit">
              <Typography
                variant="h4"
                color={link.color}
                sx={{
                  fontWeight: link.weight,
                  textTransform: 'none',
                }}
              >
                {link.text}
              </Typography>
            </Button>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  )
}
