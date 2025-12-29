'use client'

import { memo } from 'react'
import Box from '@mui/material/Box'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

import { useImageStore } from '@/services/stores'

const imageStyle = {
  objectFit: 'contain' as const,
  width: '100%',
  height: '100%',
  display: 'block',
}

export const ImageComparison = memo(function ImageComparison() {
  const inputURI = useImageStore((state) => state.inputURI)
  const outputURI = useImageStore((state) => state.outputURI)

  const hasOutput = outputURI !== null

  return (
    <Box
      role="region"
      aria-label={hasOutput ? 'Image comparison - drag slider to compare before and after' : 'Input image preview'}
      sx={{
        position: 'relative',
        width: 'fit-content',
        minWidth: { xs: '350px', sm: '500px', md: '650px' },
        minHeight: { xs: '260px', sm: '375px', md: '490px' },
        maxHeight: { xs: '70vh', sm: '75vh', md: '80vh' },
        borderRadius: { xs: 1, sm: 2 },
        overflow: 'hidden',
        boxShadow: inputURI ? 3 : 1,
        transition: 'box-shadow 0.3s ease-in-out',
        mb: 2,
        '& .react-compare-slider': {
          minWidth: 'inherit',
          minHeight: 'inherit',
          maxHeight: 'inherit',
        },
      }}
    >
      {hasOutput ? (
        <ReactCompareSlider
          itemOne={
            inputURI ? (
              <ReactCompareSliderImage src={inputURI} alt="Before image" style={imageStyle} />
            ) : null
          }
          itemTwo={<ReactCompareSliderImage src={outputURI} alt="After image" style={imageStyle} />}
          style={{
            width: '100%',
            height: '100%',
            minWidth: 'inherit',
            minHeight: 'inherit',
          }}
        />
      ) : (
        inputURI && (
          <Box
            component="img"
            src={inputURI}
            alt="Input image"
            sx={{
              ...imageStyle,
              maxWidth: '100%',
              maxHeight: 'inherit',
            }}
          />
        )
      )}
    </Box>
  )
})

ImageComparison.displayName = 'ImageComparison'
