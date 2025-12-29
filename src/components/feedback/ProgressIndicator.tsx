'use client'

import { memo } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { useProcessingStore, getProgressText } from '@/services/stores'
import { useReducedMotion } from '@/hooks'

interface ProgressIndicatorProps {
  showText?: boolean
  compact?: boolean
}

export const ProgressIndicator = memo(function ProgressIndicator({
  showText = true,
  compact = false,
}: ProgressIndicatorProps) {
  const status = useProcessingStore((state) => state.status)
  const progress = useProcessingStore((state) => state.progress)
  const prefersReducedMotion = useReducedMotion()

  if (status !== 'processing') return null

  const progressValue = progress?.progress ?? 0
  const progressText = getProgressText(progress)

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 0.5 : 1,
      }}
      role="status"
      aria-live="polite"
      aria-label={progressText}
    >
      {showText && (
        <Typography
          variant={compact ? 'caption' : 'body2'}
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {progressText}
        </Typography>
      )}

      <LinearProgress
        variant={progress?.stage === 'loading-models' ? 'indeterminate' : 'determinate'}
        value={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressValue)}
        aria-valuetext={progressText}
        sx={{
          height: compact ? 4 : 6,
          borderRadius: 1,
          // Disable animation if user prefers reduced motion
          ...(prefersReducedMotion && {
            '& .MuiLinearProgress-bar': {
              transition: 'none',
            },
          }),
        }}
      />

      {!compact && progress?.currentChunk !== undefined && progress?.totalChunks !== undefined && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {progress.currentChunk} / {progress.totalChunks} chunks
          {progress.totalIterations !== undefined && progress.totalIterations > 1 && (
            <> (Pass {progress.currentIteration ?? 1}/{progress.totalIterations})</>
          )}
        </Typography>
      )}
    </Box>
  )
})

ProgressIndicator.displayName = 'ProgressIndicator'
