import TitleBar from '@/components/titlebar'
import { Grid2 } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export default function DonatePage() {
  return (
    <Grid2 container direction="column" sx={{ minHeight: '100vh' }}>
      <Grid2>
        <TitleBar />
      </Grid2>
      <Grid2>
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <iframe
              id="kofiframe"
              src="https://ko-fi.com/thefuturegadgetslab/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{
                border: 'none',
                padding: '0px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.0)',
                height: '100vh',
              }}
              height="90vh"
              title="thefuturegadgetslab"
            ></iframe>
          </Box>
        </Container>
      </Grid2>
    </Grid2>
  )
}
