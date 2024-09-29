import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'

const HEADER_LINKS = [
  { text: 'About', href: '/about', weight: 450, color: 'text.primary' },
  { text: 'WaifuXL', href: '/', weight: 600, color: 'secondary.main' },
  { text: 'Donate', href: '/donate', weight: 450, color: 'text.primary' },
] as const

export default function TitleBar() {
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
