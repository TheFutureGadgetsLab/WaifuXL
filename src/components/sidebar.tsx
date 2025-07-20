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
        height: isMobile ? '100%' : UI_CONFIG.layout.contentHeight,
        '& .MuiDrawer-paper': {
          p: 2,
        },
      }}
      component="aside"
      role="complementary"
      aria-label="Image processing controls and results"
    >
      {isMobile && (
        <Typography
          variant="h6"
          color="primary"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 'bold',
          }}
        >
          WaifuXL Controls
        </Typography>
      )}

      <Container
        sx={{
          mt: isMobile ? 0 : 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          {renderButtons()}
          {renderUpscaleSelect()}
        </Box>
      </Container>

      {(tags.topChars.length > 0 || tags.topDesc.length > 0) && (
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
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
      )}
    </Box>
  )
}

export default Sidebar
