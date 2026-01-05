'use client'

import { PageLayout } from '@/components/layout'
import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { Favorite, Coffee } from '@mui/icons-material'
import { useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import { EXTERNAL_LINKS, THEME_COLORS, RESPONSIVE } from '@/constants'

export default function DonatePage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = EXTERNAL_LINKS.kofiWidgetScript
    script.async = true
    script.onload = () => {
      const windowWithKofi = window as Window & { kofiWidgetOverlay?: { draw: (id: string, config: object) => void } }
      if (windowWithKofi.kofiWidgetOverlay) {
        windowWithKofi.kofiWidgetOverlay.draw(EXTERNAL_LINKS.kofiHandle, {
          type: 'floating-chat',
          'floating-chat.donateButton.text': 'Support WaifuXL',
          'floating-chat.donateButton.background-color': THEME_COLORS.primary,
          'floating-chat.donateButton.text-color': '#fff',
        })
      }
    }
    script.onerror = () => {
      console.warn('Ko-fi widget failed to load')
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleDirectDonation = () => {
    window.open(EXTERNAL_LINKS.kofi, '_blank', 'noopener,noreferrer')
  }

  return (
    <PageLayout>
      <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              // 200px accounts for titlebar + padding to vertically center the card
              minHeight: 'calc(100vh - 200px)',
              py: 2,
              pt: 8,
            }}
          >
            <Card
              elevation={0}
              sx={{
                maxWidth: 600,
                width: '100%',
                textAlign: 'center',
                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Coffee
                  sx={{
                    fontSize: { xs: 48, sm: 64 },
                    color: 'primary.main',
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: RESPONSIVE.headingFontSize.xs, sm: RESPONSIVE.headingFontSize.sm },
                  }}
                >
                  Support WaifuXL
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: RESPONSIVE.bodyFontSize, mb: 2 }}
                >
                  Enjoying the free AI image upscaling? Consider buying us a coffee to show your appreciation and
                  support future improvements!
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                  All image processing happens in your browser - no servers, no costs, just your support for continued
                  development.
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleDirectDonation}
                    startIcon={<Favorite />}
                    color="donation"
                    sx={{
                      fontSize: RESPONSIVE.bodyFontSize,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    Buy us a Ko-fi
                  </Button>
                </Box>

                <Typography variant="caption" display="block" sx={{ mt: 3, opacity: 0.7 }}>
                  Secure donation via Ko-fi.com
                </Typography>
              </CardContent>
            </Card>
      </Box>
    </PageLayout>
  )
}
