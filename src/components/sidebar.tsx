import { useAppStateStore, useImageStore } from '@/services/useState'
import { copyImageToClipboard, downloadImage } from '@/services/utils'
import { useUpscale } from '@/services/useUpscale'
import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import { UPSCALE_FACTORS, UI_CONFIG, STYLES } from '@/constants'
import TagDisplay from './tags'

const Sidebar = () => {
  const tags = useImageStore((state) => state.tags)
  const outputURI = useImageStore((state) => state.outputURI)
  const upscaleFactor = useImageStore((state) => state.upscaleFactor)
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)
  const running = useAppStateStore((state) => state.running)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const handleUpscale = useUpscale()

  const hasProcessed = outputURI !== null

  const renderButtons = () => (
    <>
      <Button
        onClick={() => setInputModalOpen(true)}
        startIcon={<CloudUpload />}
        disabled={running}
        color="primary"
        variant="contained"
        fullWidth
      >
        Choose Image
      </Button>
      {outputURI ? (
        <>
          <Button
            onClick={() => downloadImage(outputURI)}
            startIcon={<CloudDownload />}
            disabled={!hasProcessed}
            color="primary"
            variant="contained"
            fullWidth
          >
            Download
          </Button>
          <Button
            onClick={() => copyImageToClipboard(outputURI)}
            startIcon={<CopyAll />}
            disabled={!hasProcessed}
            color="primary"
            variant="contained"
            fullWidth
          >
            Copy to Clipboard
          </Button>
        </>
      ) : (
        <Button
          onClick={handleUpscale}
          startIcon={<RunCircle />}
          disabled={running}
          color="primary"
          variant="contained"
          fullWidth
        >
          Run
        </Button>
      )}
    </>
  )

  const renderUpscaleSelect = () =>
    !outputURI && (
      <FormControl fullWidth>
        <InputLabel>Factor</InputLabel>
        <Select
          disabled={running}
          value={upscaleFactor.toString()}
          color="primary"
          label="Upscale Factor"
          onChange={(e: SelectChangeEvent<string>) => setUpscaleFactor(parseInt(e.target.value))}
        >
          {UPSCALE_FACTORS.map((factor) => (
            <MenuItem key={factor} value={factor / 2}>
              {factor}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )

  return (
    <Box
      sx={{
        '& .MuiDrawer-paper': {
          padding: 2,
        },
        display: { xs: 'none', [UI_CONFIG.layout.sidebarBreakpoint]: 'block' },
      }}
    >
      <Container sx={{ marginTop: 2 }}>
        <Box sx={{ ...STYLES.flexColumn, gap: 2 }}>
          {renderButtons()}
          {renderUpscaleSelect()}
        </Box>
      </Container>
      <TagDisplay title="Top Characters" tags={tags.topChars} />
      <Divider sx={{ mt: 2 }} />
      <TagDisplay title="Top Descriptors" tags={tags.topDesc} />
    </Box>
  )
}

export default Sidebar
