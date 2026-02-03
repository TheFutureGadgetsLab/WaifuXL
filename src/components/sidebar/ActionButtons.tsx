'use client'

import { memo, useCallback } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'

import { useImageStore, useProcessingStore } from '@/services/stores'
import { copyImageToClipboard, downloadImage } from '@/services/utils'
import { useUpscale, useReducedMotion } from '@/hooks'
import { ProgressIndicator } from '@/components/feedback'
import { STYLES } from '@/constants'

interface ActionButtonsProps {
  onOpenModal: () => void
}

export const ActionButtons = memo(function ActionButtons({ onOpenModal }: ActionButtonsProps) {
  const outputURI = useImageStore((state) => state.outputURI)
  const status = useProcessingStore((state) => state.status)
  const prefersReducedMotion = useReducedMotion()

  const { execute, cancel } = useUpscale()

  const isProcessing = status === 'processing'
  const hasOutput = outputURI !== null

  const showFlash = status === 'complete' && !prefersReducedMotion

  const handleDownload = useCallback(() => {
    if (outputURI) downloadImage(outputURI)
  }, [outputURI])

  const handleCopy = useCallback(() => {
    if (outputURI) copyImageToClipboard(outputURI)
  }, [outputURI])

  return (
    <Stack spacing={{ xs: 1.5, sm: 2 }}>
      <Button
        onClick={onOpenModal}
        startIcon={<CloudUploadIcon />}
        disabled={isProcessing}
        variant="contained"
        fullWidth
      >
        Choose Image
      </Button>

      {isProcessing && <ProgressIndicator compact />}

      {hasOutput ? (
        <>
          <Button
            onClick={handleDownload}
            startIcon={<CloudDownloadIcon />}
            variant="contained"
            fullWidth
            sx={showFlash ? STYLES.flashAnimation : undefined}
          >
            Download
          </Button>
          <Button
            onClick={handleCopy}
            startIcon={<CopyAllIcon />}
            variant="contained"
            fullWidth
          >
            Copy to Clipboard
          </Button>
        </>
      ) : (
        <Button
          onClick={isProcessing ? cancel : execute}
          startIcon={isProcessing ? <StopIcon /> : <PlayArrowIcon />}
          variant="contained"
          color={isProcessing ? 'error' : 'primary'}
          fullWidth
        >
          {isProcessing ? 'Cancel' : 'Run'}
        </Button>
      )}
    </Stack>
  )
})

ActionButtons.displayName = 'ActionButtons'
