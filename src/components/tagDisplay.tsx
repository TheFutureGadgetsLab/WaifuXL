import { Divider, List, ListItem, ListItemText, Pagination, Typography, CircularProgress, Box } from '@mui/material'
import React, { useState } from 'react'

import { useImageStore } from '@/services/useState'

interface tagDisplayTypes {
  title: string
  index: string
}

interface tagTypes {
  0: string
  1: number
}
export function TagDisplayComponent({ title, index }: tagDisplayTypes) {
  let { tags } = useImageStore()
  const [tagPage, setTagPage] = useState(1)
  let curTags = [] as tagTypes[]
  let maxTagPage = 0
  if (tags != null) {
    const tagIndex = tags[index]

    curTags = tagIndex?.slice(5 * (tagPage - 1), 5 * tagPage)
    maxTagPage = Math.ceil(tagIndex?.length / 5)
  }

  return (
    <>
      <Typography align="center" sx={{ fontWeight: 'bold', marginTop: 2 }}>
        {title}
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {curTags.map((x: tagTypes) => (
          <span key={`${x[0]}-sp`}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                      {`${truncateString(x[0])}`}
                      <Box sx={{ float: 'right', position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress size={30} color="primary" value={x[1] * 100} variant="determinate" />
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
                          <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
                            x[1] * 100,
                          )}%`}</Typography>
                        </Box>
                      </Box>
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" variant="middle" />
          </span>
        ))}
      </List>
      <Pagination
        hidden={index == 'rating'}
        count={maxTagPage}
        boundaryCount={0}
        page={tagPage}
        onChange={(_event: React.ChangeEvent<unknown>, value: number) => setTagPage(value)}
      />
      <Divider sx={{ marginTop: 2 }} variant="fullWidth" />
    </>
  )
}

function titleCase(str: string) {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase()
  })
}

function truncateString(str: string) {
  str = cleanStringRemoveParen(str)
  return str.length > 25 ? str.slice(0, 25) + '…' : str
}

function cleanStringRemoveParen(str: string) {
  return titleCase(str.split('(')[0].replace(/_/g, ' '))
}

function cleanString(str: string) {
  return titleCase(str.replace(/_/g, ' '))
}
