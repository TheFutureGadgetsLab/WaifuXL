import { Head, Html, Main, NextScript } from 'next/document';

import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>WaifuXL</title>
      <meta name="description" content="Wandb sucks" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
