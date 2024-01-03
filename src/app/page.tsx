'use client'
import { Box, Container, Grid } from '@mui/material'

import ImageDisplayComponent from '@/components/imageDisplay'
import ModalComponent from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleComponent from '@/components/title'
import { ImageUpload, DownloadImage, RunModel } from '@/components/inputs'
import { useImageStore } from '@/services/useState'
export default function HomePage() {
  const { outputURI } = useImageStore()

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Sidebar />
        <ImageDisplayComponent />
        <TitleComponent />
        <ModalComponent />
        <Grid
          sx={{
            display: { xs: 'block', sm: 'none' },
            marginTop: 2,
          }}
        >
          {outputURI != null ? (
            <>
              <ImageUpload />
              <DownloadImage sx={{}} />
            </>
          ) : (
            <>
              <RunModel />
            </>
          )}
        </Grid>
      </Box>
    </Container>
  )
}
