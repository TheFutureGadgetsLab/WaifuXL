'use client'

import { memo, useCallback } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { PRESET_IMAGES } from '@/constants'

interface PresetSelectorProps {
  value: string
  onChange: (value: string, url: string) => void
}

export const PresetSelector = memo(function PresetSelector({ value, onChange }: PresetSelectorProps) {
  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const index = event.target.value
      const preset = PRESET_IMAGES[parseInt(index, 10)]
      if (preset) {
        onChange(index, preset.url)
      }
    },
    [onChange]
  )

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="preset-select-label">Preset</InputLabel>
      <Select
        labelId="preset-select-label"
        value={value}
        label="Preset"
        onChange={handleChange}
        aria-describedby="preset-select-helper"
      >
        {PRESET_IMAGES.map((preset, i) => (
          <MenuItem value={i.toString()} key={i}>
            {preset.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
})

PresetSelector.displayName = 'PresetSelector'
