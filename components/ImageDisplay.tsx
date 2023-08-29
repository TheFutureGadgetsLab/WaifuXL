import { FC } from 'react';
import Image from 'next/image';
import { ReactCompareSlider } from 'react-compare-slider';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface ImageDisplayProps {
  inputURI: string | StaticImport;
  outputURI: string | StaticImport;
}

interface ImageProps {
  src: string | StaticImport;
  width: number;
  height: number;
  alt: string;
}

const ImageDisplay: FC<ImageDisplayProps> = ({ inputURI, outputURI }) => {
  const renderImage = (src: string | StaticImport, alt: string) => (
    <ImageContainer src={src} width={500} height={500} alt={alt} />
  );

  return (
    <div id="image-display-container">
      {outputURI == null ? (
        renderImage(inputURI, 'Before image')
      ) : (
        <ReactCompareSlider
          position={50}
          itemOne={renderImage(inputURI, 'Before image')}
          itemTwo={renderImage(outputURI, 'After image')}
        />
      )}
    </div>
  );
};

const ImageContainer: FC<ImageProps> = ({ src, width, height, alt }) => (
  <Image
    width={width}
    height={height}
    src={src}
    id="after-image"
    className="z-0"
    priority
    alt={alt}
    loader={imageLoader}
    unoptimized
  />
);

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number | undefined;
  quality?: number | undefined;
}) => {
  return `${src}`;
};

export default ImageDisplay;
