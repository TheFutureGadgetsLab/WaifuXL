import TitleBar from '@/components/titlebar'
import { Box, Container, Grid } from '@mui/material'

export default function DonatePage() {
  return (
    <Grid container direction="column" sx={{ minHeight: '100vh' }}>
      <Grid>
        <TitleBar />
      </Grid>
      <Grid>
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
      </Grid>
    </Grid>
  )
}
