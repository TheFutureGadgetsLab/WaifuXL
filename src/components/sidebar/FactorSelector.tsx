'use client'

import { memo, useCallback } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { UPSCALE_FACTORS } from '@/constants'
import { useImageStore, useProcessingStore, UpscaleFactor } from '@/services/stores'

export const FactorSelector = memo(function FactorSelector() {
  const outputURI = useImageStore((state) => state.outputURI)
  const upscaleFactor = useImageStore((state) => state.upscaleFactor)
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)
  const status = useProcessingStore((state) => state.status)

  const isProcessing = status === 'processing'

  const handleChange = useCallback(
    (e: SelectChangeEvent<number>) => {
      setUpscaleFactor(Number(e.target.value) as UpscaleFactor)
    },
    [setUpscaleFactor]
  )

  // Hide selector when we have output (already processed)
  if (outputURI !== null) return null

  return (
    <FormControl fullWidth>
      <InputLabel id="upscale-factor-label">Upscale Factor</InputLabel>
      <Select
        labelId="upscale-factor-label"
        id="upscale-factor-select"
        disabled={isProcessing}
        value={upscaleFactor}
        label="Upscale Factor"
        onChange={handleChange}
      >
        {UPSCALE_FACTORS.map((factor) => (
          <MenuItem key={factor} value={Math.log2(factor) as UpscaleFactor}>
            {factor}x
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
})

FactorSelector.displayName = 'FactorSelector'
