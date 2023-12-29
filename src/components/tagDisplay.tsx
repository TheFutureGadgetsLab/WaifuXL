import { Box, CircularProgress, Divider, List, ListItem, ListItemText, Pagination, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'

import { ModelTag } from '@/services/inference/tagging'

const itemsPerPage = 5

interface TagDisplayComponentProps {
  title: string
  tags: ModelTag[]
}

export function TagDisplayComponent({ title, tags }: TagDisplayComponentProps) {
  const [tagPage, setTagPage] = useState<number>(1)

  const curTags = useMemo(() => tags.slice(itemsPerPage * (tagPage - 1), itemsPerPage * tagPage), [tags, tagPage])
  const maxTagPage = useMemo(() => Math.ceil(tags.length / itemsPerPage), [tags])

  return (
    <>
      <Typography align="center" sx={{ fontWeight: 'bold', marginTop: 2 }}>
        {title}
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {curTags.map((tag) => (
          <React.Fragment key={`${tag.name}-fragment`}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                    {truncateString(tag.name)}
                    <CircularProgressWithLabel value={tag.prob * 100} />
                  </Typography>
                }
              />
            </ListItem>
            <Divider component="li" variant="middle" />
          </React.Fragment>
        ))}
      </List>
      <PaginationControlled maxTagPage={maxTagPage} tagPage={tagPage} setTagPage={setTagPage} title={title} />
      <Divider sx={{ marginTop: 2 }} variant="fullWidth" />
    </>
  )
}

function CircularProgressWithLabel({ value }: { value: number }) {
  return (
    <Box sx={{ float: 'right', position: 'relative', display: 'inline-flex' }}>
      <CircularProgress size={30} color="primary" value={value} variant="determinate" />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}`}
        </Typography>
      </Box>
    </Box>
  )
}

function PaginationControlled({
  maxTagPage,
  tagPage,
  setTagPage,
  title,
}: {
  maxTagPage: number
  tagPage: number
  setTagPage: React.Dispatch<React.SetStateAction<number>>
  title: string
}) {
  return (
    <Pagination
      hidden={title === 'Explicitness'}
      count={maxTagPage}
      boundaryCount={0}
      page={tagPage}
      onChange={(_, value) => setTagPage(value)}
    />
  )
}

function titleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
}

function cleanStringRemoveParen(str: string): string {
  return titleCase(str.split('(')[0].replace(/_/g, ' '))
}

function truncateString(str: string): string {
  str = cleanStringRemoveParen(str)
  return str.length > 25 ? str.slice(0, 25) + '…' : str
}
