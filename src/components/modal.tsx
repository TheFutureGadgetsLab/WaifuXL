'use client'

import { Box, Modal } from '@mui/material'
import { ImageUpload, ModalDone, PresetSelect } from './inputs'
import { useAppStateStore, useImageStore } from '../services/useState'

export default function ModalComponent() {
  const { inputModalOpen, setInputModalOpen } = useAppStateStore()
  const { setSelectedPreset } = useAppStateStore()
  const { setInputURI, inputURI } = useImageStore()

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
                setInputURI(inp.files[0])
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
