import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@src/components/ErrorFallback";
// import SwrProvider from "@src/contexts/SwrContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider as JotaiProvider, Atom } from "jotai";
import { projectScope } from "@src/atoms/projectScope";
import { DebugAtoms } from "@src/atoms/utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
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
    <ErrorBoundary
      fallbackRender={
        // Can’t use <ErrorFallback> here because it uses useLocation,
        // which needs to be inside a <Router>
        ({ error }) => (
          <div role="alert">
            <h1>Something went wrong</h1>
            <p>{error.message}</p>
          </div>
        )
      }
    >
      <BrowserRouter>
        <HelmetProvider>
          <JotaiProvider
            key={projectScope.description}
            scope={projectScope}
            initialValues={initialAtomValues}
          >
            <DebugAtoms scope={projectScope} />
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
          </JotaiProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
