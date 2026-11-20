'use client'

import { memo, useCallback, useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { BACKENDS } from '@/constants'
import { useImageStore, useProcessingStore } from '@/services/stores'
import type { InferenceBackend } from '@/services/inference'

export const BackendSelector = memo(function BackendSelector() {
  const outputURI = useImageStore((state) => state.outputURI)
  const status = useProcessingStore((state) => state.status)
  const backend = useImageStore((state) => state.backend)
  const setBackend = useImageStore((state) => state.setBackend)
  const [webgpuSupported, setWebgpuSupported] = useState(false)

  useEffect(() => {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
    gpu?.requestAdapter().then((adapter) => setWebgpuSupported(!!adapter)).catch(() => {})
  }, [])

  const handleChange = useCallback(
    (e: SelectChangeEvent<InferenceBackend>) => {
      setBackend(e.target.value as InferenceBackend)
    },
    [setBackend]
  )

  if (!webgpuSupported || outputURI !== null) return null

  return (
    <FormControl fullWidth>
      <InputLabel id="backend-label">Backend</InputLabel>
      <Select
        labelId="backend-label"
        id="backend-select"
        disabled={status === 'processing'}
        value={backend}
        label="Backend"
        onChange={handleChange}
      >
        {Object.entries(BACKENDS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
})

BackendSelector.displayName = 'BackendSelector'
