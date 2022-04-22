import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@src/components/ErrorFallback";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "jotai";
import { globalScope } from "@src/atoms/globalScope";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import ThemeProvider from "@src/theme/ThemeProvider";
import SnackbarProvider from "@src/contexts/SnackbarContext";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

export const muiCache = createCache({ key: "mui", prepend: true });

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  // <StrictMode>
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <BrowserRouter>
      <HelmetProvider>
        <Provider scope={globalScope}>
          <CacheProvider value={muiCache}>
            <ThemeProvider>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <SnackbarProvider>
                  <App />
                </SnackbarProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </CacheProvider>
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </ErrorBoundary>
  // </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
