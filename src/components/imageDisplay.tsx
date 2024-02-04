'use client'

import Image from 'next/image'
// @ts-ignore
import { ReactCompareSlider } from 'react-compare-slider'
import { useImageStore } from '@/services/useState'

export default function ImageDisplayComponent() {
  const { inputURI, outputURI } = useImageStore()
  return (
    <>
      {outputURI == null ? (
        <Image src={inputURI} width="500" height="500" alt="base image" priority={true}/>
      ) : (
        <ReactCompareSlider
          itemOne={<Image src={inputURI} width="500" height="500" alt="before image" priority={true}/>}
          itemTwo={<Image src={outputURI} width="500" height="500" alt="after image" priority={true}/>}
        />
      )}
    </>
  )
}
