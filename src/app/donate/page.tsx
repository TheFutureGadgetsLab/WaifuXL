'use client'

import TitleBar from '@/components/titlebar'
import { Box, Container, Grid, Typography, Button, Card, CardContent } from '@mui/material'
import { Favorite, Coffee } from '@mui/icons-material'
import { useEffect } from 'react'

export default function DonatePage() {
  useEffect(() => {
    // Load Ko-fi widget script
    const script = document.createElement('script')
    script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js'
    script.async = true
    script.onload = () => {
      // Initialize Ko-fi widget if script loads successfully
      const windowWithKofi = window as Window & { kofiWidgetOverlay?: { draw: (id: string, config: object) => void } }
      if (windowWithKofi.kofiWidgetOverlay) {
        windowWithKofi.kofiWidgetOverlay.draw('thefuturegadgetslab', {
          type: 'floating-chat',
          'floating-chat.donateButton.text': 'Support WaifuXL',
          'floating-chat.donateButton.background-color': '#FF869C',
          'floating-chat.donateButton.text-color': '#fff',
        })
      }
    }
    script.onerror = () => {
      console.warn('Ko-fi widget failed to load')
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script)
    }
  }, [])

  const handleDirectDonation = () => {
    window.open('https://ko-fi.com/thefuturegadgetslab', '_blank', 'noopener,noreferrer')
  }

  return (
    <Grid container direction="column" sx={{ minHeight: '100vh' }}>
      <Grid>
        <TitleBar />
      </Grid>
      <Grid
        sx={{
          flexGrow: 1,
          background: 'url(/MobileBG.svg) bottom center / contain no-repeat',
          backgroundSize: { xs: 'cover', sm: 'contain' },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              minHeight: 'calc(100vh - 200px)',
              py: 2,
              pt: 8,
            }}
          >
            <Card
              sx={{
                maxWidth: 600,
                width: '100%',
                textAlign: 'center',
                boxShadow: 0,
                border: 'none',
                backgroundColor: 'transparent',
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
                    fontSize: { xs: '1.8rem', sm: '2.2rem' },
                  }}
                >
                  Support WaifuXL
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, mb: 2 }}
                >
                  Enjoying the free AI image upscaling? Consider buying us a coffee to help keep WaifuXL running and
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
                    sx={{
                      backgroundColor: '#FF5F5F',
                      color: 'white',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#FF4444',
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    Buy me a Ko-fi
                  </Button>
                </Box>

                <Typography variant="caption" display="block" sx={{ mt: 3, opacity: 0.7 }}>
                  Secure donation via Ko-fi.com
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Grid>
    </Grid>
  )
}
