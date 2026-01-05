'use client'

import { memo, useState, useCallback, useId } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import DoneIcon from '@mui/icons-material/Done'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ImageIcon from '@mui/icons-material/Image'

import { useImageStore, useProcessingStore } from '@/services/stores'
import { getImageURI } from '@/services/utils'
import { parseError } from '@/services/errors'
import { UI_CONFIG, STYLES } from '@/constants'
import { PresetSelector } from './PresetSelector'

interface ImageModalProps {
  open: boolean
  onClose: () => void
}

export const ImageModal = memo(function ImageModal({ open, onClose }: ImageModalProps) {
  const inputURI = useImageStore((state) => state.inputURI)
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setError = useProcessingStore((state) => state.setError)

  // Local state for preset selection
  const [selectedPreset, setSelectedPreset] = useState('')
  const fileInputId = useId()
  const showDropzoneBorder = !inputURI

  const handleClose = useCallback(() => {
    setSelectedPreset('')
    onClose()
  }, [onClose])

  const processInput = useCallback(
    async (input: File | string) => {
      try {
        const uri = await getImageURI(input)
        setInputURI(uri)
      } catch (error) {
        setError(parseError(error))
      }
    },
    [setInputURI, setError]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        processInput(file)
        setSelectedPreset('')
      }
    },
    [processInput]
  )

  const handlePresetChange = useCallback(
    (preset: string, url: string) => {
      setSelectedPreset(preset)
      processInput(url)
    },
    [processInput]
  )

  const handleComplete = useCallback(() => {
    handleClose()
  }, [handleClose])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="image-upload-modal-title"
      aria-describedby="upload-image-or-select-preset"
      maxWidth={false}
      scroll="paper"
      PaperProps={{
        sx: {
          border: `${UI_CONFIG.modal.borderWidth} solid`,
          borderColor: 'divider',
          borderRadius: { xs: 1, sm: 2 },
          boxShadow: { xs: 8, sm: 24 },
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: '95%', sm: '90%' },
          maxWidth: UI_CONFIG.modal.maxWidth,
          maxHeight: { xs: '90vh', sm: 'auto' },
        },
      }}
    >
      <DialogTitle id="image-upload-modal-title" sx={{ p: 0, mb: 1 }}>
        Select an image
      </DialogTitle>
      <DialogContent
        id="upload-image-or-select-preset"
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image preview / upload area */}
        <ButtonBase
          component="label"
          htmlFor={fileInputId}
          disableRipple
          sx={{
            margin: '0 auto',
            marginBottom: { xs: 1.5, sm: 2 },
            width: '100%',
            height: UI_CONFIG.modal.imageHeight,
            cursor: 'pointer',
            p: 0,
            ...STYLES.flexCenter,
            transition: 'all 0.2s ease-in-out',
            borderRadius: { xs: 1, sm: 2 },
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
          aria-label="Click to upload image"
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              ...(showDropzoneBorder ? STYLES.borderDashedResponsive : {}),
              ...STYLES.flexCenter,
              flexDirection: 'column',
              gap: { xs: 0.5, sm: 1 },
              transition: 'all 0.2s ease-in-out',
              overflow: 'hidden',
              borderRadius: { xs: 1, sm: 2 },
              bgcolor: inputURI ? 'grey.100' : 'transparent',
              '&:hover': showDropzoneBorder
                ? {
                    borderColor: 'primary.dark',
                    bgcolor: 'action.hover',
                  }
                : {},
            }}
          >
            {inputURI ? (
              <Box
                component="img"
                src={inputURI}
                alt="Selected image preview"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              <>
                <ImageIcon
                  sx={{
                    fontSize: UI_CONFIG.modal.iconSize,
                    color: 'primary.main',
                  }}
                  aria-hidden="true"
                />
                <Typography
                  variant="body1"
                  color="primary.main"
                  fontWeight="medium"
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    textAlign: 'center',
                  }}
                >
                  Click to upload an image
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    textAlign: 'center',
                  }}
                >
                  or choose a preset below
                </Typography>
              </>
            )}
          </Box>
        </ButtonBase>

        {/* Preset selector */}
        <PresetSelector value={selectedPreset} onChange={handlePresetChange} />
        <input
          id={fileInputId}
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileInput}
          aria-label="Select image file"
        />
      </DialogContent>
      <DialogActions
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Button
          component="label"
          htmlFor={fileInputId}
          variant="outlined"
          color="primary"
          startIcon={<CloudUploadIcon />}
          sx={{
            minWidth: UI_CONFIG.modal.minButtonWidth,
            order: { xs: 2, sm: 1 },
          }}
          aria-label="Browse and select image files"
        >
          Browse Files
        </Button>
        <Button
          onClick={handleComplete}
          variant="contained"
          color="success"
          endIcon={<DoneIcon />}
          sx={{
            order: { xs: 1, sm: 2 },
          }}
          aria-label="Confirm image selection"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
})

ImageModal.displayName = 'ImageModal'
