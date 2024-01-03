'use client'

import { Box, Container } from '@mui/material'

import Image from 'next/image'
// @ts-ignore
import { ReactCompareSlider } from 'react-compare-slider'
import { useImageStore } from '../services/useState'

export default function ImageDisplayComponent() {
  const { inputURI, outputURI } = useImageStore()
  return (
    <>
      {outputURI == null ? (
        <Image src={inputURI} width="500" height="500" alt="base image" />
      ) : (
        <ReactCompareSlider
          itemOne={<Image src={inputURI} width="500" height="500" alt="before image" />}
          itemTwo={<Image src={outputURI} width="500" height="500" alt="after image" />}
        />
      )}
    </>
  )
}
