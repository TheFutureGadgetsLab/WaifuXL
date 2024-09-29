import { upscaleAndTag } from '@/services/inference'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { copyImageToClipboard, downloadImage } from '@/services/utils'
import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from '@mui/material'
import React from 'react'
import TagDisplayComponent from './tags'

const StyledSidebar = styled(Box)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('md')]: { display: 'none' },
  [theme.breakpoints.up('md')]: { display: 'block' },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

const SideBarComponent: React.FC = () => {
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
      <StyledButton
        onClick={() => setInputModalOpen(true)}
        startIcon={<CloudUpload />}
        disabled={running}
        color="primary"
        variant="contained"
      >
        Choose Image
      </StyledButton>
      {outputURI ? (
        <>
          <StyledButton
            onClick={() => downloadImage(outputURI)}
            startIcon={<CloudDownload />}
            disabled={hasntRun}
            color="primary"
            variant="contained"
          >
            Download
          </StyledButton>
          <StyledButton
            onClick={() => copyImageToClipboard(outputURI)}
            startIcon={<CopyAll />}
            disabled={hasntRun}
            color="primary"
            variant="contained"
          >
            Copy to Clipboard
          </StyledButton>
        </>
      ) : (
        <StyledButton
          onClick={handleUpscale}
          startIcon={<RunCircle />}
          disabled={running}
          color="primary"
          variant="contained"
        >
          Run
        </StyledButton>
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
          {[2, 4, 8].map((factor) => (
            <MenuItem key={factor} value={factor / 2}>
              {factor}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )

  return (
    <StyledSidebar>
      <Container sx={{ marginTop: 2 }}>
        <ButtonGroup
          orientation="vertical"
          aria-label="Vertical button group"
          variant="contained"
          fullWidth={true}
          sx={{ boxShadow: 0 }}
        >
          {renderButtons()}
          {renderUpscaleSelect()}
        </ButtonGroup>
      </Container>
      <TagDisplayComponent title="Top Characters" tags={tags.topChars} />
      <Divider sx={{ mt: 2 }} />
      <TagDisplayComponent title="Top Descriptors" tags={tags.topDesc} />
    </StyledSidebar>
  )
}

export default SideBarComponent
