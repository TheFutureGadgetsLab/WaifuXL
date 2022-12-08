import 'tailwindcss/tailwind.css'
import './globals.css'

import Head from 'next/head'
import { registerEventHandlers } from '@/services/windowUtilities'

function MyApp({ Component, pageProps }) {
  registerEventHandlers()

  return (
    <>
      <Head>
        <title>WaifuXL</title>
        <meta
          name="description"
          content="High quality image upsampling for anime-style art using state-of-the-art neural networks, directly in your browser. Supports both images and gifs."
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
