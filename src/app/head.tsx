import { ASSETS, DEFAULT_IMAGES } from '@/constants'

export default function Head() {
  const title = 'WaifuXL'
  const description =
    'Local-first anime image upscaler that runs entirely in your browser.'
  const siteUrl = 'https://waifuxl.com'
  const ogImage = `${siteUrl}${DEFAULT_IMAGES.output}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="WaifuXL upscaling preview" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
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
