import '@elastic/eui/dist/eui_theme_light.css';

import type { AppProps } from 'next/app';
import { EuiProvider } from '@elastic/eui';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EuiProvider colorMode="light">
      <Component {...pageProps} />
    </EuiProvider>
  );
}