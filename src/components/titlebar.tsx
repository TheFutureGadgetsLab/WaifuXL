import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'

import { HEADER_LINKS } from '@/constants'

const TitleBar = () => {
  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        {HEADER_LINKS.map(({ text, href, weight, color }) => (
          <Link href={href} key={text} passHref>
            <Button color="inherit">
              <Typography variant="h4" color={color} sx={{ fontWeight: weight, textTransform: 'none' }}>
                {text}
              </Typography>
            </Button>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  )
}

export default TitleBar
