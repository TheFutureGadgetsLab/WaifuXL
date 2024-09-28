'use client'

import { useAppStateStore, useImageStore } from '@/services/useState'
import { Done } from '@mui/icons-material'
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'

interface Preset {
  name: string
  url: string
}

const PRESET_LIST: Preset[] = [
  { name: 'Ozen', url: 'https://i.imgur.com/Sf6sfPj.png' },
  { name: 'Senjougahara', url: 'https://i.imgur.com/cMX8YcK.jpg' },
  { name: 'Moomin', url: 'https://i.imgur.com/9I91yMq.png' },
  { name: 'Megumin', url: 'https://i.imgur.com/BKBt6bC.png' },
  { name: 'Aqua', url: 'https://i.imgur.com/yhIwVjZ.jpeg' },
  { name: 'Natsumi', url: 'https://i.imgur.com/yIIl7Z1.png' },
]

export default function ModalComponent() {
  const { inputModalOpen, setInputModalOpen, selectedPreset, setSelectedPreset } = useAppStateStore()
  const { inputURI, setInputURI, setTags } = useImageStore()

  const handleClose = () => {
    setInputModalOpen(false)
    setInputURI(inputURI)
    setSelectedPreset('')
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setInputURI(file)
      setSelectedPreset('')
    }
  }

  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    setSelectedPreset(event.target.value)
    const [, url] = event.target.value.split('|')
    setInputURI(url)
  }

  const handleDone = () => {
    setInputURI(inputURI)
    setTags({ topDesc: [], topChars: [], rating: [] })
    setInputModalOpen(false)
    setSelectedPreset('')
  }

  return (
    <Modal open={inputModalOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          component="label"
          sx={{
            display: 'block',
            margin: '0 auto 10px',
            width: 'auto',
            height: '24rem',
            backgroundImage: `url(${inputURI})`,
            boxShadow: 'inset 0px 0px 12px #00000050',
            backgroundOrigin: 'content-box',
            backgroundSize: 'cover',
            cursor: 'pointer',
          }}
        >
          <input type="file" hidden accept="image/*" onChange={handleFileInput} />
        </Box>
        <FormControl color="success" sx={{ minWidth: 200, marginBottom: 2 }} fullWidth>
          <InputLabel>Preset</InputLabel>
          <Select color="success" value={selectedPreset} label="Preset" onChange={handlePresetChange}>
            {PRESET_LIST.map((preset, i) => (
              <MenuItem color="success" value={`${preset.name}|${preset.url}`} key={i}>
                {preset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          component="label"
          variant="contained"
          size="large"
          sx={{ color: '#fff', marginRight: 2 }}
          color="success"
        >
          Upload
          <input type="file" hidden accept="image/*" onChange={handleFileInput} />
        </Button>
        <Button
          onClick={handleDone}
          variant="contained"
          sx={{ float: 'right', marginLeft: 2 }}
          color="success"
          endIcon={<Done />}
        >
          Done
        </Button>
      </Box>
    </Modal>
  )
}
