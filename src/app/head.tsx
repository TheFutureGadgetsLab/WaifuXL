import { ASSETS, DEFAULT_IMAGES } from '@/constants'

export default function Head() {
  return (
    <>
      <title>WaifuXL</title>
      <link
        rel="preload"
        as="image"
        href={DEFAULT_IMAGES.input}
        type="image/webp"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={DEFAULT_IMAGES.output}
        type="image/webp"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={ASSETS.desktopBg}
        type="image/svg+xml"
        media="(min-width: 1200px)"
      />
      <link rel="preload" as="image" href={ASSETS.mobileBg} type="image/svg+xml" />
    </>
  )
}
