import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'

import { HEADER_LINKS } from '@/constants'

const TitleBar = () => {
  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={0}
      sx={{
        minHeight: { xs: 64, sm: 70 },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'center',
          minHeight: { xs: 64, sm: 70 },
          px: { xs: 1, sm: 2 },
        }}
      >
        {HEADER_LINKS.map(({ text, href, weight, color }) => (
          <Link href={href} key={text} passHref>
            <Button
              color="inherit"
              sx={{
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              <Typography
                variant="h4"
                color={color}
                sx={{
                  fontWeight: weight,
                  textTransform: 'none',
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                }}
              >
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
