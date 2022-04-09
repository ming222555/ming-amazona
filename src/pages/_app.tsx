import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
// import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../Theme';
import createEmotionCache from '../../src/createEmotionCache';

import { StoreProvider } from '../utils/Store';
import ThemeAdjust from '../ThemeAdjust';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider> */}
      <StoreProvider>
        <ThemeAdjust theme={theme}>
          <>
            <CssBaseline />
            <Component {...pageProps} />
          </>
        </ThemeAdjust>
      </StoreProvider>
    </CacheProvider>
  );
}
