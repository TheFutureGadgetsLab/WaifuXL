import ImageDisplayComponent from '@/components/imageDisplay'
import ModalComponent from '@/components/modal'
import Sidebar from '@/components/sidebar'
import {Box, Container} from '@mui/material'

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
        <ImageDisplayComponent/>
        <ModalComponent />

      </Box>
    </Container>
  )
}
