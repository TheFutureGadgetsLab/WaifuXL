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
  Stack,
  Typography,
} from '@mui/material'

import { UPSCALE_FACTORS, UI_CONFIG } from '@/constants'
import TagDisplay from './tags'

interface SidebarProps {
  isMobile?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const tags = useImageStore((state) => state.tags)
  const outputURI = useImageStore((state) => state.outputURI)
  const upscaleFactor = useImageStore((state) => state.upscaleFactor)
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)
  const running = useAppStateStore((state) => state.running)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const handleUpscale = useUpscale()

  const hasProcessed = outputURI !== null

  return (
    <Box
      sx={{
        ...(!isMobile && {
          display: { xs: 'none', [UI_CONFIG.layout.sidebarBreakpoint]: 'flex' },
          width: UI_CONFIG.layout.sidebarWidth,
          flexShrink: 0,
        }),
        ...(isMobile && {
          width: '100%',
          display: 'flex',
        }),
        flexDirection: 'column',
        height: isMobile ? '100vh' : 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}
      component="aside"
      role="complementary"
      aria-label="Image processing controls and results"
    >
      <Stack
        direction="column"
        sx={{
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {isMobile && (
          <Typography
            variant="h6"
            color="primary"
            sx={{
              textAlign: 'center',
              mb: 2,
              mt: 1,
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            WaifuXL Controls
          </Typography>
        )}

        <Container
          sx={{
            mt: isMobile ? 0 : 2,
            px: { xs: 2, sm: 3 },
            flexShrink: 0,
          }}
        >
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            <SidebarButtons
              running={running}
              outputURI={outputURI}
              hasProcessed={hasProcessed}
              setInputModalOpen={setInputModalOpen}
              handleUpscale={handleUpscale}
            />
            <UpscaleSelect
              outputURI={outputURI}
              running={running}
              upscaleFactor={upscaleFactor}
              setUpscaleFactor={setUpscaleFactor}
            />
          </Stack>
        </Container>

        <TagSection tags={tags} />
      </Stack>
    </Box>
  )
}

interface SidebarButtonsProps {
  running: boolean
  outputURI: string | null
  hasProcessed: boolean
  setInputModalOpen: (open: boolean) => void
  handleUpscale: () => void
}

const SidebarButtons: React.FC<SidebarButtonsProps> = ({
  running,
  outputURI,
  hasProcessed,
  setInputModalOpen,
  handleUpscale,
}) => {
  const shouldFlashDownloadButton = useAppStateStore((state) => state.shouldFlashDownloadButton)
  const setShouldFlashDownloadButton = useAppStateStore((state) => state.setShouldFlashDownloadButton)

  const handleDownloadClick = () => {
    if (shouldFlashDownloadButton) {
      setShouldFlashDownloadButton(false)
    }
    downloadImage(outputURI)
  }

  return (
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
          onClick={handleDownloadClick}
          startIcon={<CloudDownload />}
          disabled={!hasProcessed}
          color="primary"
          variant="contained"
          fullWidth
          sx={{
            animation: shouldFlashDownloadButton ? 'flash 2s infinite' : 'none',
            '@keyframes flash': {
              '0%, 50%': { opacity: 1 },
              '25%, 75%': { opacity: 0.4 },
            },
          }}
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
}

interface UpscaleSelectProps {
  outputURI: string | null
  running: boolean
  upscaleFactor: number
  setUpscaleFactor: (factor: number) => void
}

const UpscaleSelect: React.FC<UpscaleSelectProps> = ({ outputURI, running, upscaleFactor, setUpscaleFactor }) =>
  !outputURI ? (
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
  ) : null

interface TagSectionProps {
  tags: {
    topChars: Array<{ name: string; prob: number }>
    topDesc: Array<{ name: string; prob: number }>
  }
}

const TagSection: React.FC<TagSectionProps> = ({ tags }) =>
  tags.topChars.length > 0 || tags.topDesc.length > 0 ? (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        mt: 1,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          pb: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'primary.main',
            borderRadius: '3px',
            '&:hover': {
              background: 'primary.dark',
            },
          },
        }}
      >
        <TagDisplay title="Top Characters" tags={tags.topChars} />
        <Divider sx={{ mt: 2, mb: 1 }} />
        <TagDisplay title="Top Descriptors" tags={tags.topDesc} />
      </Box>
    </Box>
  ) : null

export default Sidebar
