'use client';
import Image from 'next/image';
import { useAppStateStore, useImageStore } from '../services/useState';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

export default function ImageDisplayComponent() {
    const { inputURI, outputURI } = useImageStore();
    return (<>{outputURI == null ?
        (<Image src={inputURI} width="500" height="500" alt="base image" />)
        :
        (<ReactCompareSlider
            itemOne={<Image src={inputURI} width="500" height="500" alt="before image" />}
            itemTwo={<Image src={outputURI} width="500" height="500" alt="after image" />}
        />)
    }
    </>);
}