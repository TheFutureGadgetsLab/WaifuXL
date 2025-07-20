import { useMemo, useState, memo } from 'react'
import { Box, CircularProgress, List, ListItem, ListItemText, Pagination, Typography } from '@mui/material'

import { ModelTag } from '@/services/inference'
import { truncateString } from '@/services/utils'
import { TAGS_PER_PAGE, UI_CONFIG, STYLES } from '@/constants'

interface TagDisplayProps {
  title: string
  tags: ModelTag[]
}

const TagDisplay = memo(({ title, tags }: TagDisplayProps) => {
  const [tagPage, setTagPage] = useState(1)

  const curTags = useMemo(() => tags.slice(TAGS_PER_PAGE * (tagPage - 1), TAGS_PER_PAGE * tagPage), [tags, tagPage])
  const maxTagPage = Math.ceil(tags.length / TAGS_PER_PAGE)

  if (tags.length === 0) return null

  return (
    <Box>
      <Typography align="center" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
        {title}
      </Typography>
      <List dense>
        {curTags.map(({ name, prob }) => (
          <ListItem key={name} sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography component="span" variant="body2" sx={{ flex: 1, mr: 1 }}>
                    {truncateString(name)}
                  </Typography>
                  <CircularProgressWithLabel value={prob * 100} />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      {maxTagPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Pagination
            count={maxTagPage}
            page={tagPage}
            onChange={(_, value) => setTagPage(value)}
            size="small"
            aria-label={`${title} pagination`}
          />
        </Box>
      )}
    </Box>
  )
})

TagDisplay.displayName = 'TagDisplay'

interface CircularProgressWithLabelProps {
  value: number
}

const CircularProgressWithLabel = memo(({ value }: CircularProgressWithLabelProps) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress size={UI_CONFIG.circularProgressSize} value={value} variant="determinate" color="primary" />
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
          aria-label={`${Math.round(value)} percent confidence`}
        >
          {Math.round(value)}
        </Typography>
      </Box>
    </Box>
  )
})

CircularProgressWithLabel.displayName = 'CircularProgressWithLabel'

export default TagDisplay
