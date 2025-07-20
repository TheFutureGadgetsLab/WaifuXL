'use client'

import { SelectChangeEvent } from '@mui/material'
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { Done, CloudUpload, Image } from '@mui/icons-material'

import { useAppStateStore, useImageStore } from '@/services/useState'
import { PRESET_IMAGES, MODAL_CONFIG } from '@/constants'

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    width: '90%',
    maxWidth: MODAL_CONFIG.maxWidth,
  },
  imagePreview: {
    margin: '0 auto 16px',
    width: '100%',
    height: MODAL_CONFIG.imageHeight,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    border: '2px dashed',
    borderColor: 'primary.main',
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: 'primary.dark',
      backgroundColor: 'action.hover',
    },
  },
  uploadPrompt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    color: 'text.secondary',
  },
} as const

function ImageModal() {
  const { inputModalOpen, setInputModalOpen, selectedPreset, setSelectedPreset } = useAppStateStore()
  const { inputURI, setInputURI, setTags } = useImageStore()

  const handleClose = () => {
    setInputModalOpen(false)
    setSelectedPreset('')
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setInputURI(URL.createObjectURL(file))
      setSelectedPreset('')
    }
  }

  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    setSelectedPreset(event.target.value)
    const [, url] = event.target.value.split('|')
    setInputURI(url)
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
          component="label"
          sx={{
            ...styles.imagePreview,
            backgroundImage: inputURI ? `url(${inputURI})` : 'none',
          }}
        >
          {!inputURI && (
            <Box sx={styles.uploadPrompt}>
              <Image sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="body1" color="primary.main" fontWeight="medium">
                Click to upload an image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or choose a preset below
              </Typography>
            </Box>
          )}
          <input type="file" hidden accept="image/*" onChange={handleFileInput} />
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Preset</InputLabel>
          <Select value={selectedPreset} label="Preset" onChange={handlePresetChange}>
            {PRESET_IMAGES.map((preset, i) => (
              <MenuItem value={`${preset.name}|${preset.url}`} key={i}>
                {preset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            component="label"
            variant="outlined"
            color="primary"
            startIcon={<CloudUpload />}
            sx={{ minWidth: 120 }}
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
