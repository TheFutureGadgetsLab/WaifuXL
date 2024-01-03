'use client'

import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select } from '@mui/material'
import { getDataURIFromInput, setDataURIFromFile } from '@/services/imageUtilities'
import { useAppStateStore, useImageStore } from '../services/useState'
import { ImageUpload, ModalDone, PresetSelect } from './inputs'

export default function ModalComponent() {
  const { inputModalOpen, setInputModalOpen } = useAppStateStore()
  const { setSelectedPreset } = useAppStateStore()
  const { setInputURI, inputURI, setFileName } = useImageStore()

  return (
    <Modal
      open={inputModalOpen}
      onClose={() => {
        setInputModalOpen(false)
        setInputURI(inputURI)
        setSelectedPreset('')
      }}
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
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
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 10,
            width: 'auto',
            height: '24rem',
            backgroundImage: `url(${inputURI})`,
            boxShadow: 'inset 0px 0px 12px #00000050',
            backgroundOrigin: 'content-box',
            backgroundSize: 'cover',
            cursor: 'pointer',
          }}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onInput={(e) => {
              let inp = e.target as HTMLInputElement
              if (inp.files && inp.files[0]) {
                setDataURIFromFile(inp.files[0], setInputURI)
                setFileName(inp.files[0].name.split('.')[0])
                setSelectedPreset('')
              }
            }}
          />
        </Box>
        <PresetSelect />
        <ImageUpload />
        <ModalDone />
      </Box>
    </Modal>
  )
}
