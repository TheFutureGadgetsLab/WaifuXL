import { upscaleAndTag } from '@/services/inference'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { copyImageToClipboard, downloadImage } from '@/services/utils'
import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import { Box, Button, Container, Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { UPSCALE_FACTORS, LAYOUT } from '@/constants'
import TagDisplay from './tags'

function Sidebar() {
  const { tags, outputURI, hasntRun, inputURI, upscaleFactor, setOutputURI, setUpscaleFactor, setTags } =
    useImageStore()
  const { running, setInputModalOpen, setDownloadReady, setRunning } = useAppStateStore()

  const handleUpscale = async () => {
    try {
      setRunning(true)
      const result = await upscaleAndTag(setTags, inputURI, upscaleFactor)
      if (result) setOutputURI(result)
    } finally {
      setDownloadReady(true)
      setRunning(false)
      setUpscaleFactor(1)
    }
  }

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
            disabled={hasntRun}
            color="primary"
            variant="contained"
            fullWidth
          >
            Download
          </Button>
          <Button
            onClick={() => copyImageToClipboard(outputURI)}
            startIcon={<CopyAll />}
            disabled={hasntRun}
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
          onChange={(e) => setUpscaleFactor(parseInt(e.target.value as string))}
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
        display: { xs: 'none', [LAYOUT.sidebarBreakpoint]: 'block' },
      }}
    >
      <Container sx={{ marginTop: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
