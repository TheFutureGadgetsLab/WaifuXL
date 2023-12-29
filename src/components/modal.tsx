'use client'

import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select } from '@mui/material'
import { getDataURIFromInput, setDataURIFromFile } from '@/services/imageUtilities'
import { useAppStateStore, useImageStore } from '../services/useState'

import { getEmptyTags } from '@/services/inference/tagging'

const preset_list = [
  {
    name: 'Ozen',
    url: 'https://i.imgur.com/Sf6sfPj.png',
  },
  {
    name: 'Senjougahara',
    url: 'https://i.imgur.com/cMX8YcK.jpg',
  },
  {
    name: 'Moomin',
    url: 'https://i.imgur.com/9I91yMq.png',
  },
  {
    name: 'Megumin',
    url: 'https://i.imgur.com/BKBt6bC.png',
  },
  {
    name: 'Aqua',
    url: 'https://i.imgur.com/yhIwVjZ.jpeg',
  },
  {
    name: 'Natsumi',
    url: 'https://i.imgur.com/yIIl7Z1.png',
  },
]

export default function ModalComponent() {
  const { inputModalOpen, setInputModalOpen } = useAppStateStore()
  const { selectedPreset, setSelectedPreset } = useAppStateStore()
  const { setInputURI, setTags, inputURI, setFileName } = useImageStore()

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
        <FormControl color="success" sx={{ minWidth: 200, marginBottom: 2 }} fullWidth>
          <InputLabel>Preset</InputLabel>
          <Select
            color="success"
            value={selectedPreset}
            label="Preset"
            onChange={(inp) => {
              setSelectedPreset(inp.target.value)
              const [name, url] = inp.target.value.split('|')
              getDataURIFromInput(url).then((uri) => setInputURI(uri))
              setFileName(`example_${name}`)
            }}
          >
            {preset_list.map((preset) => (
              <MenuItem color="success" value={`${preset.name}|${preset.url}`}>
                {preset.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          component="label"
          key="ModalUpload"
          variant="contained"
          size="large"
          sx={{ color: '#fff', marginRight: 2 }}
          color="success"
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
          Upload
        </Button>
        <Button
          key="ModalDone"
          onClick={() => {
            setInputURI(inputURI)
            setTags(getEmptyTags())
            setInputModalOpen(false)
            setSelectedPreset('')
          }}
          variant="outlined"
          size="large"
          sx={{ float: 'right', marginLeft: 2 }}
          color="success"
        >
          Done
        </Button>
      </Box>
    </Modal>
  )
}
