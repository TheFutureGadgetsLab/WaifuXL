'use client'

import TitleBar from '@/components/titlebar'
import { Box, Container, Grid, Typography, Card, CardContent, Chip } from '@mui/material'
import { Visibility, People, Code, Memory, CloudOff, Speed, GitHub, Article } from '@mui/icons-material'
import React from 'react'

export default function AboutPage() {
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
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '280px 1fr',
            lg: '320px 1fr 300px',
            xl: '320px 1fr 400px',
          },
        }}
      >
        <Box sx={{ gridColumn: { xs: 1, md: 2, lg: 2 }, display: { xs: 'none', md: 'block' } }} />
        <Container
          maxWidth="md"
          sx={{
            gridColumn: {
              xs: 1,
              md: 2,
              lg: 2,
            },
          }}
        >
          <Box
            sx={{
              py: { xs: 2, sm: 3 },
            }}
          >
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  color: 'primary.main',
                }}
              >
                About WaifuXL
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                State-of-the-art AI image upscaling that runs entirely in your browser
              </Typography>
            </Box>

            {/* Feature Cards */}
            <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <FeatureCard icon={<CloudOff />} title="100% Local" description="Your images never leave your device" />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <FeatureCard
                  icon={<Speed />}
                  title="Lightning Fast"
                  description="Real-time processing with WebAssembly"
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <FeatureCard icon={<Memory />} title="AI Powered" description="Real-ESRGAN" />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <FeatureCard icon={<Visibility />} title="No Signup" description="Start upscaling immediately" />
              </Grid>
            </Grid>

            {/* Main Content */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2 },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                backdropFilter: 'blur(10px)',
              }}
            >
              <Section title="At A Glance" icon={<Visibility />}>
                <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.6 }}>
                  <strong>WaifuXL</strong> provides state-of-the-art upscaling directly in your browser at the click of
                  a button. No need to choose noise levels, no captcha, and your images are never sent to us. Everything
                  is done locally using cutting-edge WebAssembly technology!
                </Typography>
              </Section>

              <Section title="About Us" icon={<People />}>
                <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.6, mb: 1.5 }}>
                  Hi, we&apos;re the <strong>Future Gadgets Lab</strong>! We&apos;re passionate about making advanced
                  technology accessible to everyone.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<GitHub />}
                    label="View Organization"
                    component="a"
                    href="https://github.com/TheFutureGadgetsLab"
                    target="_blank"
                    clickable
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Section>

              <Section title="Technical Details" icon={<Code />}>
                <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.6, mb: 2 }}>
                  We deliver neural networks that execute directly in your browser. Here&apos;s what powers WaifuXL:
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                  <TechChip label="Real-ESRGAN" href="https://arxiv.org/abs/2107.10833" />
                  <TechChip label="MobileNetV3" href="https://arxiv.org/abs/1905.02244" />
                  <TechChip label="ONNX Runtime" href="https://onnxruntime.ai/" />
                  <TechChip label="React" href="https://reactjs.org/" />
                  <TechChip label="Next.js" href="https://nextjs.org/" />
                  <TechChip label="Material-UI" href="https://mui.com/" />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Article />}
                    label="Read Full Write-up"
                    component="a"
                    href="https://haydn.fgl.dev/posts/the-launch-of-waifuxl/"
                    target="_blank"
                    clickable
                    color="secondary"
                    variant="filled"
                  />
                </Box>
              </Section>
            </Box>
          </Box>
        </Container>
        <Box sx={{ gridColumn: { lg: 3, xl: 3 }, display: { xs: 'none', lg: 'block' } }} />
      </Grid>
    </Grid>
  )
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        {icon && <Box sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }}>{icon}</Box>}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box
          sx={{
            color: 'primary.main',
            fontSize: { xs: 32, sm: 36 },
            mb: 1.5,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

function TechChip({ label, href }: { label: string; href: string }) {
  return <Chip label={label} component="a" href={href} target="_blank" clickable size="small" variant="outlined" />
}
