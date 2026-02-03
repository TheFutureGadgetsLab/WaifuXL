'use client'

import { memo, useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Pagination from '@mui/material/Pagination'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { ModelTag } from '@/services/inference'
import { truncateString } from '@/services/utils'
import { useImageStore } from '@/services/stores'
import { TAGS_PER_PAGE, UI_CONFIG, STYLES } from '@/constants'

// Progress indicator with label
const CircularProgressWithLabel = memo(function CircularProgressWithLabel({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        size={UI_CONFIG.circularProgressSize}
        value={value}
        variant="determinate"
        color="primary"
        aria-label={`${label} confidence ${Math.round(value)} percent`}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          ...STYLES.flexCenter,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: UI_CONFIG.captionFontSize }}
          aria-label={`${label} confidence ${Math.round(value)} percent`}
        >
          {Math.round(value)}
        </Typography>
      </Box>
    </Box>
  )
})

CircularProgressWithLabel.displayName = 'CircularProgressWithLabel'

// Single tag list component
interface TagListProps {
  title: string
  tags: ModelTag[]
}

const TagList = memo(function TagList({ title, tags }: TagListProps) {
  const [page, setPage] = useState(1)
  const maxPage = Math.ceil(tags.length / TAGS_PER_PAGE)

  // Clamp page to valid range - handles edge case when tags shrink
  const effectivePage = page > maxPage ? 1 : page

  const currentTags = tags.slice(TAGS_PER_PAGE * (effectivePage - 1), TAGS_PER_PAGE * effectivePage)

  if (tags.length === 0) return null

  return (
    <Box>
      <Typography align="center" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
        {title}
      </Typography>
      <List dense>
        {currentTags.map(({ name, prob }) => (
          <ListItem key={name} sx={{ py: 0.5 }}>
            <ListItemText
              disableTypography
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Tooltip title={name} arrow enterTouchDelay={0}>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ flex: 1, mr: 1, cursor: 'default' }}
                    >
                      {truncateString(name)}
                    </Typography>
                  </Tooltip>
                  <CircularProgressWithLabel value={prob * 100} label={name} />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      {maxPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Pagination
            count={maxPage}
            page={effectivePage}
            onChange={(_, value) => setPage(value)}
            size="small"
            aria-label={`${title} pagination`}
          />
        </Box>
      )}
    </Box>
  )
})

TagList.displayName = 'TagList'

// Main tag display component
export const TagDisplay = memo(function TagDisplay() {
  const tags = useImageStore((state) => state.tags)

  const hasCharacters = tags.topChars.length > 0
  const hasDescriptors = tags.topDesc.length > 0

  if (!hasCharacters && !hasDescriptors) return null

  return (
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
        role="region"
        aria-label="Image tags"
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          pb: 2,
          ...STYLES.scrollbar,
        }}
      >
        {hasCharacters && <TagList title="Top Characters" tags={tags.topChars} />}
        {hasCharacters && hasDescriptors && <Divider sx={{ mt: 2, mb: 1 }} />}
        {hasDescriptors && <TagList title="Top Descriptors" tags={tags.topDesc} />}
      </Box>
    </Box>
  )
})

TagDisplay.displayName = 'TagDisplay'
