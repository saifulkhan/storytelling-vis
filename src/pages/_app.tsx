import type { ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import createCache from "@emotion/cache";

const defaultTheme = createTheme();

// Create a simple emotion cache for client-side rendering
const createEmotionCache = (): EmotionCache => {
  return createCache({ key: 'css' });
};

const clientSideEmotionCache = createEmotionCache();

type GetLayout = (page: ReactNode) => ReactNode;

type Page<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

type MyAppProps<P = {}> = AppProps<P> & {
  emotionCache?: EmotionCache;
  Component: Page<P>;
};

function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | Storyboard"
          defaultTitle="Storyboard"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MuiThemeProvider theme={defaultTheme}>
            {getLayout(<Component {...pageProps} />)}
          </MuiThemeProvider>
        </LocalizationProvider>
      </HelmetProvider>
    </CacheProvider>
  );
}

export default App;
