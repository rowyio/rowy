import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@src/components/ErrorFallback";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider, Atom } from "jotai";
import { globalScope } from "@src/atoms/globalScope";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import ThemeProvider from "@src/theme/ThemeProvider";
import SnackbarProvider from "@src/contexts/SnackbarContext";

import { Suspense } from "react";
import Loading from "@src/components/Loading";

export const muiCache = createCache({ key: "mui", prepend: true });

export interface IProvidersProps {
  children: React.ReactNode;
  initialAtomValues?: Iterable<readonly [Atom<unknown>, unknown]>;
}

export default function Providers({
  children,
  initialAtomValues,
}: IProvidersProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <HelmetProvider>
          <Provider scope={globalScope} initialValues={initialAtomValues}>
            <CacheProvider value={muiCache}>
              <ThemeProvider>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <SnackbarProvider>
                    <Suspense fallback={<Loading fullScreen />}>
                      {children}
                    </Suspense>
                  </SnackbarProvider>
                </ErrorBoundary>
              </ThemeProvider>
            </CacheProvider>
          </Provider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
