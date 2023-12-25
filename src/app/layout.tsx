import * as React from 'react'

import { CloudDownload, CloudUpload, CopyAll } from '@mui/icons-material'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import Link from 'next/link'
import { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

export const metadata: Metadata = {
  title: 'WaifuXL',
  description: 'nyaa~',
}

const DRAWER_WIDTH = 300

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
            }}
          >
            <SideBar />
            {children}
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  )
}

function HeaderBar() {
  const HEADER_LINKS = [
    { text: 'About', href: '/about', weight: 450 },
    { text: 'WaifuXL', href: '/', weight: 600 },
    { text: 'Donate', href: '/donate', weight: 450 },
  ]

  return (
    // @ts-ignore
    <AppBar sx={{ zIndex: 2000, boxShadow: 'none' }} color="pink">
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
                color="text.primary"
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

function SideBar() {
  const SIDEBAR_LINKS = [
    { text: 'Choose Image / GIF', href: '/', icon: CloudUpload },
    { text: 'Download', href: '/starred', icon: CloudDownload },
    { text: 'Post To Imgur', href: '/tasks', icon: CopyAll },
  ]

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: ['48px', '56px', '64px'],
          height: 'auto',
          bottom: 0,
          padding: 2,
          bgcolor: '#f5f5f5',
        },
      }}
      open={true}
      variant="persistent"
    >
      {SIDEBAR_LINKS.map(({ text, href, icon: Icon }) => (
        <Button
          key={href}
          component={Link}
          href={href}
          variant="contained"
          size="large"
          sx={{
            justifyContent: 'flex-start',
            marginBottom: 2,
            ':not(:last-child)': {
              marginBottom: 1,
            },
            color: '#fff',
          }}
          startIcon={<Icon />}
          // @ts-ignore
          color="pink"
        >
          {text}
        </Button>
      ))}
    </Drawer>
  )
}
