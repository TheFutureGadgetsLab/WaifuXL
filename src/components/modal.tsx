'use client'

import { SelectChangeEvent } from '@mui/material'
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { Done, CloudUpload, Image } from '@mui/icons-material'

import { useAppStateStore, useImageStore } from '@/services/useState'
import { PRESET_IMAGES, UI_CONFIG, STYLES } from '@/constants'

const ImageModal = () => {
  const inputModalOpen = useAppStateStore((state) => state.inputModalOpen)
  const selectedPreset = useAppStateStore((state) => state.selectedPreset)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const setSelectedPreset = useAppStateStore((state) => state.setSelectedPreset)
  const inputURI = useImageStore((state) => state.inputURI)
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setTags = useImageStore((state) => state.setTags)
  const resetOutput = useImageStore((state) => state.resetOutput)

  const closeModal = () => {
    setInputModalOpen(false)
    setSelectedPreset('')
  }

  const processInput = (input: File | string) => {
    setInputURI(input)
    setSelectedPreset(typeof input === 'string' ? selectedPreset : '')
    resetOutput()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processInput(file)
    }
  }

  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    setSelectedPreset(event.target.value)
    const [, url] = event.target.value.split('|')
    processInput(url)
  }

  const handleComplete = () => {
    setTags({ topDesc: [], topChars: [], rating: [] })
    closeModal()
  }

  return (
    <Modal
      open={inputModalOpen}
      onClose={closeModal}
      aria-labelledby="image-upload-modal"
      aria-describedby="upload-image-or-select-preset"
    >
      <Box
        sx={{
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
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: { xs: 1, sm: 2 },
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
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: { xs: 1, sm: 2 },
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
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="preset-select-label">Preset</InputLabel>
          <Select
            labelId="preset-select-label"
            value={selectedPreset}
            label="Preset"
            onChange={handlePresetChange}
            aria-describedby="preset-select-helper"
          >
            {PRESET_IMAGES.map((preset, i) => (
              <MenuItem value={`${preset.name}|${preset.url}`} key={i}>
                {preset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            startIcon={<CloudUpload />}
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
            endIcon={<Done />}
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
}

export default ImageModal
