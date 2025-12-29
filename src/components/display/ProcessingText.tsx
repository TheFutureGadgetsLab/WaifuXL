'use client'

import { memo, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useImageStore, useProcessingStore } from '@/services/stores'
import { useReducedMotion } from '@/hooks'
import { UI_CONFIG } from '@/constants'

export const ProcessingText = memo(function ProcessingText() {
  const [dots, setDots] = useState('')
  const status = useProcessingStore((state) => state.status)
  const outputURI = useImageStore((state) => state.outputURI)
  const prefersReducedMotion = useReducedMotion()

  const isProcessing = status === 'processing'
  const hasOutput = outputURI !== null

  // Animate dots while processing
  useEffect(() => {
    // Only start animation when processing and not preferring reduced motion
    if (!isProcessing || prefersReducedMotion) return

    // Reset dots on interval start
    const interval = setInterval(() => {
      setDots((prev) => (prev === '...' ? '' : `${prev}.`))
    }, UI_CONFIG.loadingTextInterval)

    return () => {
      clearInterval(interval)
      // Use callback form to avoid setState during render warning
      setDots('')
    }
  }, [isProcessing, prefersReducedMotion])

  // Determine display text based on state
  let displayText = 'Expand'
  if (hasOutput) {
    displayText = 'Download'
  } else if (isProcessing) {
    displayText = 'Expanding'
  }

  return (
    <Typography
      variant="h2"
      color="primary"
      align="center"
      role="status"
      aria-live="polite"
      sx={{
        fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
        fontWeight: { xs: 600, sm: 'bold' },
      }}
    >
      <Box component="span" sx={{ color: 'text.primary' }}>
        {displayText} your{' '}
      </Box>
      waifu
      {isProcessing ? dots : '!'}
    </Typography>
  )
})

ProcessingText.displayName = 'ProcessingText'
