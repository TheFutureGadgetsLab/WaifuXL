'use client'

import TitleBar from '@/components/titlebar'
import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'

export default function AboutPage() {
  return (
    <Grid container direction="column" sx={{ minHeight: '100vh' }}>
      <Grid>
        <TitleBar />
      </Grid>
      <Grid>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 4 }}>
            <Section title="At A Glance">
              <Typography>
                <a href="https://www.waifuxl.com">WaifuXL</a> provides state of the art upscaling directly in your
                browser at the click of a button. No need to choose a noise level, no captcha, and your images are never
                sent to us. Everything is done locally!
              </Typography>
            </Section>

            <Section title="About Us">
              <Typography>
                Hi, we&apos;re the Future Gadgets Lab! We make a lot of random stuff, check out our organization{' '}
                <a href="https://github.com/TheFutureGadgetsLab">here!</a>
              </Typography>
            </Section>

            <Section title="In Depth">
              <Typography>
                Check out the full write-up <a href="https://haydn.fgl.dev/posts/the-launch-of-waifuxl/">here!</a> We
                send you neural networks to execute directly in your browser using the{' '}
                <a href="https://onnxruntime.ai/">ONNX Runtime</a>. For the upscaling model we&apos;re using the{' '}
                <a href="https://arxiv.org/abs/2107.10833">SOTA Real-ESRGAN</a> Our tagger is a{' '}
                <a href="https://arxiv.org/abs/1905.02244">MobileNetV3</a> On the web side we&apos;re using{' '}
                <a href="https://reactjs.org/">React</a>, <a href="https://nextjs.org/">Next.js</a>, and{' '}
                <a href="https://mui.com/">Material UI</a>. We&apos;re hosted on{' '}
                <a href="https://pages.cloudflare.com/">Cloudflare Pages</a> which generously provides unlimited
                bandwith.
              </Typography>
            </Section>
          </Box>
        </Container>
      </Grid>
    </Grid>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  )
}
