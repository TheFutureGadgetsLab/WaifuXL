'use client'

import { useEffect, useState } from 'react'

import { Typography } from '@mui/material'
import { useAppStateStore } from '@/services/useState'

// Define component styles
const textStyle = { color: 'black', fontWeight: 'bold' }

export default function TitleComponent() {
  const [loadingText, setLoadingText] = useState('')
  const { running, downloadReady } = useAppStateStore()

  useEffect(() => {
    const updateLoadingText = () => {
      setLoadingText((prev) => (prev === '...' ? '' : `${prev}.`))
    }

    const interval = setInterval(updateLoadingText, 750)
    return () => clearInterval(interval)
  }, [])

  // Determine the display text based on app state
  const displayText = downloadReady ? 'Download' : running ? 'Expanding' : 'Expand'

  return (
    <Typography
      sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
      variant="h2"
      color="primary"
      paragraph
    >
      <span style={textStyle}>{displayText} your </span>
      waifu
      {running ? loadingText : '!'}
    </Typography>
  )
}
