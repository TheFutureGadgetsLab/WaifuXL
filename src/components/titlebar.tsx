import { AppBar, Box, Button, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'

import { HEADER_LINKS, UI_CONFIG } from '@/constants'

interface TitleBarProps {
  isMobile?: boolean
}

const TitleBar = ({ isMobile = false }: TitleBarProps) => {
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={0}
      sx={{
        minHeight: UI_CONFIG.layout.appBarHeight,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: isMobile ? '1fr' : '280px 1fr',
            lg: isMobile ? '1fr' : '320px 1fr 300px',
            xl: isMobile ? '1fr' : '320px 1fr 400px',
          },
          minHeight: UI_CONFIG.layout.appBarHeight,
        }}
      >
        {!isMobile && <Box sx={{ gridColumn: 1 }} />}

        <Toolbar
          sx={{
            gridColumn: {
              xs: 1,
              md: isMobile ? 1 : 2,
              lg: isMobile ? 1 : 2,
            },
            justifyContent: 'center',
            minHeight: UI_CONFIG.layout.appBarHeight,
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

        {!isMobile && isLargeScreen && <Box sx={{ gridColumn: 3 }} />}
      </Box>
    </AppBar>
  )
}

export default TitleBar
