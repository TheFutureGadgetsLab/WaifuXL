import '@elastic/eui/dist/eui_theme_light.css';

import type { AppProps } from 'next/app';
import { EuiProvider } from '@elastic/eui';
import React from 'react';
import { useEffect } from 'react';
import { useStateStateState } from 'types/stateStore';

export default function App({ Component, pageProps }: AppProps) {
  // useWindowSize();

  return (
    <EuiProvider colorMode="light">
      <Component {...pageProps} />
    </EuiProvider>
  );
}

function useWindowSize() {
  const setWindowHeight = useStateStateState((state) => state.setWindowHeight);
  const setWindowWidth = useStateStateState((state) => state.setWindowWidth);

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);
      };

      // Add event listener
      window.addEventListener('resize', handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  });
}
