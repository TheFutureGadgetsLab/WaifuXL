'use client'

import { useCallback } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useProcessingStore } from '@/services/stores'

const AUTO_HIDE_DURATION = 8000 // 8 seconds

export function ErrorToast() {
  const error = useProcessingStore((state) => state.error)
  const clearError = useProcessingStore((state) => state.clearError)

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      // Don't close on clickaway
      if (reason === 'clickaway') return
      clearError()
    },
    [clearError]
  )

  const isOpen = error !== null && error.type !== 'abort'

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={AUTO_HIDE_DURATION}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ maxWidth: { xs: '95%', sm: 500 } }}
    >
      <Alert
        severity="error"
        variant="filled"
        onClose={handleClose}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          width: '100%',
          '& .MuiAlert-message': { flex: 1 },
        }}
      >
        <AlertTitle>Error</AlertTitle>
        {error?.userMessage}
      </Alert>
    </Snackbar>
  )
}

ErrorToast.displayName = 'ErrorToast'
