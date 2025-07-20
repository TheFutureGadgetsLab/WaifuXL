'use client'

import { SelectChangeEvent } from '@mui/material'
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { Done, CloudUpload, Image } from '@mui/icons-material'

import { useAppStateStore, useImageStore } from '@/services/useState'
import { PRESET_IMAGES, UI_CONFIG, STYLES } from '@/constants'

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: `${UI_CONFIG.modal.borderWidth} solid #000`,
    boxShadow: 24,
    p: 4,
    width: '90%',
    maxWidth: UI_CONFIG.modal.maxWidth,
  },
  imagePreview: {
    margin: '0 auto 16px',
    width: '100%',
    height: UI_CONFIG.modal.imageHeight,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    ...STYLES.borderDashed,
    ...STYLES.flexCenter,
    ...STYLES.flexColumn,
    gap: 1,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: 'primary.dark',
      backgroundColor: 'action.hover',
    },
  },
  uploadPrompt: {
    ...STYLES.flexCenter,
    ...STYLES.flexColumn,
    gap: 1,
    color: 'text.secondary',
  },
} as const

const ImageModal = () => {
  const inputModalOpen = useAppStateStore((state) => state.inputModalOpen)
  const selectedPreset = useAppStateStore((state) => state.selectedPreset)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const setSelectedPreset = useAppStateStore((state) => state.setSelectedPreset)
  const inputURI = useImageStore((state) => state.inputURI)
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setTags = useImageStore((state) => state.setTags)
  const resetOutput = useImageStore((state) => state.resetOutput)

  const handleClose = () => {
    setInputModalOpen(false)
    setSelectedPreset('')
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setInputURI(file)
      setSelectedPreset('')
      resetOutput()
    }
  }

  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    setSelectedPreset(event.target.value)
    const [, url] = event.target.value.split('|')
    setInputURI(url)
    resetOutput()
  }

  const handleDone = () => {
    setTags({ topDesc: [], topChars: [], rating: [] })
    setInputModalOpen(false)
    setSelectedPreset('')
  }

  return (
    <Modal open={inputModalOpen} onClose={handleClose}>
      <Box sx={styles.modal}>
        <Box
          sx={{
            ...styles.imagePreview,
            backgroundImage: inputURI ? `url(${inputURI})` : 'none',
          }}
        >
          {!inputURI && (
            <Box sx={styles.uploadPrompt}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image sx={{ fontSize: UI_CONFIG.modal.iconSize, color: 'primary.main' }} />
              <Typography variant="body1" color="primary.main" fontWeight="medium">
                Click to upload an image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or choose a preset below
              </Typography>
            </Box>
          )}
        </Box>

        <FormControl fullWidth sx={{ mb: UI_CONFIG.modal.spacing }}>
          <InputLabel>Preset</InputLabel>
          <Select value={selectedPreset} label="Preset" onChange={handlePresetChange}>
            {PRESET_IMAGES.map((preset, i) => (
              <MenuItem value={`${preset.name}|${preset.url}`} key={i}>
                {preset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: UI_CONFIG.modal.spacing }}>
          <Button
            component="label"
            variant="outlined"
            color="primary"
            startIcon={<CloudUpload />}
            sx={{ minWidth: UI_CONFIG.modal.minButtonWidth }}
          >
            Browse Files
            <input type="file" hidden accept="image/*" onChange={handleFileInput} />
          </Button>
          <Button onClick={handleDone} variant="contained" color="success" endIcon={<Done />}>
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ImageModal
