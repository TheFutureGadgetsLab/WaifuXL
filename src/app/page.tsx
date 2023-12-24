import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export default function HomePage() {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          ml: '300px',
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
          }}
          height="712"
          title="thefuturegadgetslab"
        ></iframe>
      </Box>
    </Container>
  )
}
