import { ModelTag } from '@/services/inference'
import { truncateString } from '@/services/utils'
import { Box, CircularProgress, List, ListItem, ListItemText, Pagination, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'

interface TagDisplayComponentProps {
  title: string
  tags: ModelTag[]
}

const TagDisplayComponent: React.FC<TagDisplayComponentProps> = ({ title, tags }) => {
  const [tagPage, setTagPage] = useState(1)

  const ITEMS_PER_PAGE = 7

  const curTags = useMemo(() => tags.slice(ITEMS_PER_PAGE * (tagPage - 1), ITEMS_PER_PAGE * tagPage), [tags, tagPage])
  const maxTagPage = Math.ceil(tags.length / ITEMS_PER_PAGE)

  return (
    <>
      <Typography align="center" sx={{ fontWeight: 'bold', mt: 2 }}>
        {title}
      </Typography>
      <List dense={true}>
        {curTags.map(({ name, prob }) => (
          <ListItem key={name} alignItems="flex-start">
            <ListItemText
              primary={
                <Typography component="span" variant="body1">
                  {truncateString(name)}
                  <CircularProgressWithLabel value={prob * 100} />
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      <Pagination count={maxTagPage} page={tagPage} onChange={(_, value) => setTagPage(value)} size="small" />
    </>
  )
}

interface CircularProgressWithLabelProps {
  value: number
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({ value }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex', float: 'right' }}>
    <CircularProgress size={30} value={value} variant="determinate" />
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
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

export default TagDisplayComponent
