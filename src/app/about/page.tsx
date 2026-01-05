'use client'

import { PageLayout } from '@/components/layout'
import { Box, Chip, Grid, Typography } from '@mui/material'
import { GitHub } from '@mui/icons-material'
import { ReactNode } from 'react'
import { EXTERNAL_LINKS, RESPONSIVE, UI_CONFIG } from '@/constants'

const badges = ['Local-only', 'No signup', 'Runs in browser'] as const

export default function AboutPage() {
  return (
    <PageLayout>
      <Box
        sx={{
          minHeight: {
            xs: `calc(100vh - ${UI_CONFIG.layout.appBarHeight.xs}px)`,
            sm: `calc(100vh - ${UI_CONFIG.layout.appBarHeight.sm}px)`,
          },
          display: 'grid',
          gridTemplateRows: { xs: '1fr auto 4fr', md: '1fr auto 4fr' },
          pb: RESPONSIVE.sectionPadding,
        }}
      >
        <Box
          sx={{
            maxWidth: 860,
            mx: 'auto',
            gridRow: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: 2,
            p: { xs: 2.5, sm: 4 },
            boxShadow: '0 14px 30px rgba(23, 25, 35, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: RESPONSIVE.headingFontSize,
                color: 'text.primary',
              }}
            >
              About WaifuXL
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 640, mt: 1, fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.7 }}
            >
              A clean, local-first upscaler built for anime-style art. Drop a file, choose a scale, download the
              result.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {badges.map((badge) => (
                <Chip key={badge} label={badge} variant="outlined" />
              ))}
            </Box>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Section title="What it does">
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Upscaling happens entirely in your browser, so images never leave your device. The goal is to keep
                  the workflow fast, private, and predictable.
                </Typography>
              </Section>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Section title="Who we are">
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
                  We are the Future Gadgets Lab, a small team focused on practical, privacy-forward tools.
                </Typography>
                <Chip
                  icon={<GitHub />}
                  label="Future Gadgets Lab"
                  component="a"
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  color="primary"
                  variant="outlined"
                />
              </Section>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PageLayout>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}
