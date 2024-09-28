import { upScaleAndTag } from '@/services/inference'
import { useAppStateStore, useImageStore } from '@/services/useState'
import { CloudDownload, CloudUpload, CopyAll, RunCircle } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  Typography,
  styled,
} from '@mui/material'
import React, { useMemo, useState } from 'react'

const DRAWER_WIDTH = 300
const ITEMS_PER_PAGE = 5

interface ModelTag {
  name: string
  prob: number
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    top: [48, 56, 64].map((px) => `${px}px`),
    height: 'auto',
    bottom: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

const SideBarComponent: React.FC = () => {
  const { tags, outputURI, fileName, hasntRun, inputURI, upscaleFactor, setOutputURI, setUpscaleFactor, setTags } =
    useImageStore()
  const { running, setInputModalOpen, setDownloadReady, setRunning, setErrorMessage } = useAppStateStore()

  const pipeline = async () => {
    try {
      setRunning(true)
      const result = await upScaleAndTag(setTags, inputURI, upscaleFactor)
      if (result) setOutputURI(result)
    } catch {
      setErrorMessage('Failed to upscale image.')
    } finally {
      setDownloadReady(true)
      setRunning(false)
      setUpscaleFactor(1)
    }
  }

  const downloadImage = () => {
    if (outputURI) {
      const link = document.createElement('a')
      link.href = outputURI
      link.download = `${fileName || 'image'}.png`
      link.click()
    }
  }

  const copyImg = async () => {
    if (outputURI) {
      try {
        const imgBlob = await (await fetch(outputURI)).blob()
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': imgBlob })])
      } catch (error) {
        console.error(error)
      }
    }
  }

  const buttons = [
    {
      key: 'chooseImage',
      text: 'Choose Image',
      onClick: () => setInputModalOpen(true),
      Icon: CloudUpload,
      disabled: running,
      condition: true,
    },
    {
      key: 'download',
      text: 'Download',
      onClick: downloadImage,
      Icon: CloudDownload,
      disabled: hasntRun,
      condition: !!outputURI,
    },
    {
      key: 'copyToClipboard',
      text: 'Copy to Clipboard',
      onClick: copyImg,
      Icon: CopyAll,
      disabled: hasntRun,
      condition: !!outputURI,
    },
    { key: 'run', text: 'Run', onClick: pipeline, Icon: RunCircle, disabled: running, condition: !outputURI },
  ]

  const tagDisplays = [
    { title: 'Top Chars', tags: tags.topChars },
    { title: 'Top Desc', tags: tags.topDesc },
    { title: 'Explicitness', tags: tags.rating },
  ]

  return (
    <StyledDrawer open variant="persistent">
      {buttons.map(
        ({ key, text, onClick, Icon, disabled, condition }) =>
          condition && (
            <StyledButton
              key={key}
              onClick={onClick}
              startIcon={<Icon />}
              disabled={disabled}
              color="primary"
              variant="contained"
            >
              {text}
            </StyledButton>
          ),
      )}
      {!outputURI && (
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
      )}
      {tagDisplays.map(({ title, tags }) => (
        <TagDisplayComponent key={title} title={title} tags={tags} />
      ))}
    </StyledDrawer>
  )
}

const TagDisplayComponent: React.FC<{ title: string; tags: ModelTag[] }> = ({ title, tags }) => {
  const [tagPage, setTagPage] = useState(1)
  const curTags = useMemo(() => tags.slice(ITEMS_PER_PAGE * (tagPage - 1), ITEMS_PER_PAGE * tagPage), [tags, tagPage])
  const maxTagPage = Math.ceil(tags.length / ITEMS_PER_PAGE)

  const truncateString = (str: string) => {
    const cleaned = str
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
      .split('(')[0]
      .replace(/_/g, ' ')
    return cleaned.length > 25 ? cleaned.slice(0, 25) + '…' : cleaned
  }

  return (
    <>
      <Typography align="center" sx={{ fontWeight: 'bold', mt: 2 }}>
        {title}
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {curTags.map(({ name, prob }) => (
          <ListItem key={name} alignItems="flex-start">
            <ListItemText
              primary={
                <Typography component="span" variant="body2" color="text.primary">
                  {truncateString(name)}
                  <CircularProgressWithLabel value={prob * 100} />
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      {title !== 'Explicitness' && (
        <Pagination
          count={maxTagPage}
          page={tagPage}
          onChange={(_, value) => setTagPage(value)}
          size="small"
          sx={{ '& .MuiPagination-ul': { flexWrap: 'nowrap' } }}
        />
      )}
      <Divider sx={{ mt: 2 }} />
    </>
  )
}

const CircularProgressWithLabel: React.FC<{ value: number }> = ({ value }) => (
  <Box sx={{ float: 'right', position: 'relative', display: 'inline-flex' }}>
    <CircularProgress size={30} color="primary" value={value} variant="determinate" />
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {Math.round(value)}
      </Typography>
    </Box>
  </Box>
)

export default SideBarComponent
