'use client'

import { useImageStore } from '../services/useState'
import { ModalUpload, DownloadImage, CopyImage, RunModel, UpscaleFactor } from '@/components/inputs'
import Drawer from '@mui/material/Drawer'
import { TagDisplayComponent } from '@/components/tagDisplay'

const DRAWER_WIDTH = 300

export default function SideBarComponent() {
  const { tags } = useImageStore()
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: ['48px', '56px', '64px'],
          height: 'auto',
          bottom: 0,
          padding: 2,
          bgcolor: 'primary',
        },
        display: { xs: 'none', sm: 'block' },
      }}
      open={true}
      variant="persistent"
    >
      <ModalUpload />
      <DownloadImage />
      <CopyImage />
      <RunModel />
      <UpscaleFactor />
      <TagDisplayComponent title={'Top Chars'} tags={tags.topChars} />
      <TagDisplayComponent title={'Top Desc'} tags={tags.topDesc} />
      <TagDisplayComponent title={'Explicitness'} tags={tags.rating} />
    </Drawer>
  )
}
