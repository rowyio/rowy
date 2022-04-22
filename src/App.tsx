import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@src/components/ErrorFallback";

import { Provider } from "jotai";
import { globalScope } from "@src/atoms/globalScope";
import Loading from "@src/components/Loading";

import FirebaseProject from "@src/sources/ProjectSourceFirebase";
import ThemeProvider from "@src/theme/ThemeProvider";

const AuthPage = lazy(
  () => import("@src/pages/Auth" /* webpackChunkName: "AuthPage" */)
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <Provider scope={globalScope}>
          <ThemeProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <Loading
                    fullScreen
                    message="FirebaseProject suspended"
                    timeout={0}
                    delay={0}
                  />
                }
              >
                <FirebaseProject />
              </Suspense>
              <Suspense
                fallback={
                  <Loading
                    fullScreen
                    message="AuthPage suspended"
                    timeout={0}
                    delay={0}
                  />
                }
              >
                <AuthPage />
              </Suspense>
            </ErrorBoundary>
          </ThemeProvider>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
