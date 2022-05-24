import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@src/components/ErrorFallback";
// import SwrProvider from "@src/contexts/SwrContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider, Atom } from "jotai";
import { globalScope } from "@src/atoms/globalScope";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import RowyThemeProvider from "@src/theme/RowyThemeProvider";
import SnackbarProvider from "@src/contexts/SnackbarContext";
import { SnackLogProvider } from "@src/contexts/SnackLogContext";

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
          <Provider
            key={globalScope.description}
            scope={globalScope}
            initialValues={initialAtomValues}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CacheProvider value={muiCache}>
                <RowyThemeProvider>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <SnackbarProvider>
                      <SnackLogProvider>
                        <Suspense fallback={<Loading fullScreen />}>
                          {children}
                        </Suspense>
                      </SnackLogProvider>
                    </SnackbarProvider>
                  </ErrorBoundary>
                </RowyThemeProvider>
              </CacheProvider>
            </LocalizationProvider>
          </Provider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
