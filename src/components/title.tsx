'use client'
import { useAppStateStore } from '@/services/useState'
import { Typography } from '@mui/material'
import { useState, useEffect } from 'react'

export default function TitleComponent() {
  const [loadingText, setLoadingText] = useState('')
  const { running, downloadReady } = useAppStateStore()
  //TODO: Determine if we still want to track model load?
  const modelLoading = false
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => (prev === '...' ? '' : `${prev}.`))
    }, 750)
    return () => clearInterval(interval)
  }, [])

  const title = modelLoading ? (
    <>
      Preparing to{' '}
      <Typography variant="h2" color="primary">
        run{loadingText}
      </Typography>
    </>
  ) : (
    <>
      <Typography sx={{ fontWeight: 'bold' }} variant="h2" color="primary" paragraph={true}>
        <span style={{ color: 'black' }}>{downloadReady ? 'Download' : running ? 'Expanding' : 'Expand'} your </span>
        waifu
        {running ? loadingText : '!'}
      </Typography>
    </>
  )

  return title
}
