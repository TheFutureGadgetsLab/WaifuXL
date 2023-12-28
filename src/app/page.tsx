import { Box, Container } from '@mui/material'

import ImageDisplayComponent from '@/components/imageDisplay'
import ModalComponent from '@/components/modal'
import Sidebar from '@/components/sidebar'
import TitleComponent from '@/components/title'

export default function HomePage() {
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
      </Box>
    </Container>
  )
}
