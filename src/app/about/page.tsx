'use client'

import { PageLayout } from '@/components/layout'
import { Box, Grid, Typography, Card, CardContent, Chip } from '@mui/material'
import { Visibility, People, Code, Memory, CloudOff, Speed, GitHub, Article } from '@mui/icons-material'
import { EXTERNAL_LINKS, RESPONSIVE } from '@/constants'
import React from 'react'

export default function AboutPage() {
  return (
    <PageLayout>
      <Box sx={{ py: RESPONSIVE.sectionPadding }}>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: RESPONSIVE.headingFontSize,
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
                    href={EXTERNAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
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
                  <TechChip label="Real-ESRGAN" href={EXTERNAL_LINKS.technical.realEsrgan} />
                  <TechChip label="MobileNetV3" href={EXTERNAL_LINKS.technical.mobilenetv3} />
                  <TechChip label="ONNX Runtime" href={EXTERNAL_LINKS.technical.onnxRuntime} />
                  <TechChip label="React" href={EXTERNAL_LINKS.technical.react} />
                  <TechChip label="Next.js" href={EXTERNAL_LINKS.technical.nextjs} />
                  <TechChip label="Material-UI" href={EXTERNAL_LINKS.technical.materialUi} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Article />}
                    label="Read Full Write-up"
                    component="a"
                    href={EXTERNAL_LINKS.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    color="secondary"
                    variant="filled"
                  />
                </Box>
              </Section>
            </Box>
      </Box>
    </PageLayout>
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
  return (
    <Chip
      label={label}
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      clickable
      size="small"
      variant="outlined"
    />
  )
}
