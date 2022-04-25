import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAtom } from "jotai";

import Loading from "@src/components/Loading";
import ProjectSourceFirebase from "@src/sources/ProjectSourceFirebase";
import NotFound from "@src/pages/NotFound";
import RequireAuth from "@src/layouts/RequireAuth";
import Nav from "@src/layouts/Nav";

import { globalScope } from "@src/atoms/globalScope";
import { currentUserAtom } from "@src/atoms/auth";
import { routes } from "@src/constants/routes";

import JotaiTestPage from "@src/pages/JotaiTest";
import SignOutPage from "@src/pages/Auth/SignOut";

// prettier-ignore
const AuthPage = lazy(() => import("@src/pages/Auth/index" /* webpackChunkName: "AuthPage" */));
// prettier-ignore
const SignUpPage = lazy(() => import("@src/pages/Auth/SignUp" /* webpackChunkName: "SignUpPage" */));
// prettier-ignore
const JwtAuthPage = lazy(() => import("@src/pages/Auth/JwtAuth" /* webpackChunkName: "JwtAuthPage" */));
// prettier-ignore
const ImpersonatorAuthPage = lazy(() => import("@src/pages/Auth/ImpersonatorAuth" /* webpackChunkName: "ImpersonatorAuthPage" */));

// prettier-ignore
const SetupPage = lazy(() => import("@src/pages/Setup" /* webpackChunkName: "SetupPage" */));

export default function App() {
  const [currentUser] = useAtom(currentUserAtom, globalScope);

  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ProjectSourceFirebase />

      {currentUser === undefined ? (
        <Loading fullScreen message="Authenticating" />
      ) : (
        <Routes>
          <Route path="*" element={<NotFound />} />

          <Route path={routes.auth} element={<AuthPage />} />
          <Route path={routes.signUp} element={<SignUpPage />} />
          <Route path={routes.signOut} element={<SignOutPage />} />
          <Route path={routes.jwtAuth} element={<JwtAuthPage />} />
          <Route
            path={routes.impersonatorAuth}
            element={
              <RequireAuth>
                <ImpersonatorAuthPage />
              </RequireAuth>
            }
          />

          <Route path={routes.setup} element={<SetupPage />} />

          <Route
            path="/"
            element={
              <RequireAuth>
                <Nav />
              </RequireAuth>
            }
          >
            <Route path="dash" element={<div>Dash</div>} />
          </Route>

          <Route path="/jotaiTest" element={<JotaiTestPage />} />
        </Routes>
      )}
    </Suspense>
  );
}
