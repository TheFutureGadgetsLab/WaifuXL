'use client'

import { memo, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
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
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="image-upload-modal"
      aria-describedby="upload-image-or-select-preset"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: `${UI_CONFIG.modal.borderWidth} solid`,
          borderColor: 'divider',
          borderRadius: { xs: 1, sm: 2 },
          boxShadow: { xs: 8, sm: 24 },
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: '95%', sm: '90%' },
          maxWidth: UI_CONFIG.modal.maxWidth,
          maxHeight: { xs: '90vh', sm: 'auto' },
          overflowY: 'auto',
        }}
      >
        {/* Image preview / upload area */}
        <Box
          component="button"
          onClick={() => document.getElementById('file-input')?.click()}
          sx={{
            margin: '0 auto',
            marginBottom: { xs: 1.5, sm: 2 },
            width: '100%',
            height: UI_CONFIG.modal.imageHeight,
            cursor: 'pointer',
            bgcolor: 'transparent',
            border: 'none',
            p: 0,
            ...STYLES.flexCenter,
            transition: 'all 0.2s ease-in-out',
            '&:focus': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
          aria-label="Click to upload image"
        >
          {inputURI ? (
            <Box
              component="img"
              src={inputURI}
              alt="Selected image preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                ...STYLES.borderDashedResponsive,
                transition: 'border-color 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.dark',
                },
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                ...STYLES.borderDashedResponsive,
                ...STYLES.flexCenter,
                flexDirection: 'column',
                gap: { xs: 0.5, sm: 1 },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'action.hover',
                },
              }}
            >
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
            </Box>
          )}
        </Box>

        {/* Preset selector */}
        <PresetSelector value={selectedPreset} onChange={handlePresetChange} />

        {/* Action buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            component="label"
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
            <input
              id="file-input"
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileInput}
              aria-label="Select image file"
            />
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
        </Box>
      </Box>
    </Modal>
  )
})

ImageModal.displayName = 'ImageModal'
