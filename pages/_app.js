import "tailwindcss/tailwind.css";
import Head from "next/head";
import { Html } from "next/document";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>WaifuXL</title>
        <meta
          name="description"
          content="High quality image upsampling for anime-style art using state-of-the-art neural networks, directly in your browser. Supports both images and gifs."
        />
      </Head>
      <Component
        {...pageProps}
      />
    </>
  );
}

export default MyApp;
