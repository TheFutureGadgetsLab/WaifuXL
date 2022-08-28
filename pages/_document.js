import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/images/icon.webp"></link>
          <meta name="theme-color" content="#fff" />
          <link rel="icon" type="image/png" href="/images/icon.webp" />
          <link rel="manifest" href="/manifest.json" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Title" />
          <meta property="og:description" content="Description" />
          <meta property="og:site_name" content="Site Name" />
          <meta property="og:url" content="https://waifuxl.com/" />
          <meta property="og:image" content="https://haydn.fgl.dev/posts/the-launch-of-waifuxl/images/WaifuXL.webp" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
