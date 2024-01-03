'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function AboutPage() {
  const style = {
    maxWidth: '70%',
  }
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
        <Typography sx={style} variant="h5">
          At A Glance
        </Typography>
        <Typography sx={style} variant="body1" gutterBottom>
          <a href="https://www.waifuxl.com">WaifuXL</a> provides state of the art upscaling directly in your browser at
          the click of a button. No need to choose a noise level, no captcha, and your images are never sent to us.
          Everything is done locally!
        </Typography>
        <Typography sx={{ ...style, marginTop: 5 }} variant="h5">
          About Us
        </Typography>
        <Typography sx={style} variant="body1" gutterBottom>
          Hi, we're the Future Gadgets Lab! We make a lot of random stuff, check out our organization{' '}
          <a href="https://github.com/TheFutureGadgetsLab">here!</a>
        </Typography>
        <Typography sx={{ ...style, marginTop: 5 }} variant="h5">
          In Depth
        </Typography>
        <Typography sx={style} variant="body1" gutterBottom>
          Check out the full write-up <a href="https://haydn.fgl.dev/posts/the-launch-of-waifuxl/">here!</a> We send you
          neural networks to execute directly in your browser using the{' '}
          <a href="https://onnxruntime.ai/">ONNX Runtime</a>. For the upscaling model we're using the{' '}
          <a href="https://arxiv.org/abs/2107.10833">SOTA Real-ESRGAN</a> Our tagger is a{' '}
          <a href="https://arxiv.org/abs/1905.02244">MobileNetV3</a> On the web side we're using{' '}
          <a href="https://reactjs.org/">React</a>, <a href="https://nextjs.org/">Next.js</a>, and{' '}
          <a href="https://mui.com/">Material UI</a>. We're hosted on{' '}
          <a href="https://pages.cloudflare.com/">Cloudflare Pages</a> which generously provides unlimited bandwith.
        </Typography>
      </Box>
    </Container>
  )
}
