import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAtom } from "jotai";

import Loading from "@src/components/Loading";
import ProjectSourceFirebase from "@src/sources/ProjectSourceFirebase";
import ConfirmDialog from "@src/components/ConfirmDialog";
import RowyRunModal from "@src/components/RowyRunModal";
import NotFound from "@src/pages/NotFound";
import RequireAuth from "@src/layouts/RequireAuth";
import Navigation from "@src/layouts/Navigation";
import TableSettingsDialog from "@src/components/TableSettingsDialog";

import { globalScope, currentUserAtom } from "@src/atoms/globalScope";
import { ROUTES } from "@src/constants/routes";

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

// prettier-ignore
const TablesPage = lazy(() => import("@src/pages/Tables" /* webpackChunkName: "TablesPage" */));

// prettier-ignore
const UserSettingsPage = lazy(() => import("@src/pages/Settings/UserSettings" /* webpackChunkName: "UserSettingsPage" */));
// prettier-ignore
const ProjectSettingsPage = lazy(() => import("@src/pages/Settings/ProjectSettings" /* webpackChunkName: "ProjectSettingsPage" */));
// prettier-ignore
const UserManagementPage = lazy(() => import("@src/pages/Settings/UserManagement" /* webpackChunkName: "UserManagementPage" */));
// const RowyRunTestPage = lazy(() => import("@src/pages/RowyRunTest" /* webpackChunkName: "RowyRunTestPage" */));

export default function App() {
  const [currentUser] = useAtom(currentUserAtom, globalScope);

  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ProjectSourceFirebase />
      <ConfirmDialog />
      <RowyRunModal />

      {currentUser === undefined ? (
        <Loading fullScreen message="Authenticating" />
      ) : (
        <Routes>
          <Route path="*" element={<NotFound />} />

          <Route path={ROUTES.auth} element={<AuthPage />} />
          <Route path={ROUTES.signUp} element={<SignUpPage />} />
          <Route path={ROUTES.signOut} element={<SignOutPage />} />
          <Route path={ROUTES.jwtAuth} element={<JwtAuthPage />} />
          <Route
            path={ROUTES.impersonatorAuth}
            element={
              <RequireAuth>
                <ImpersonatorAuthPage />
              </RequireAuth>
            }
          />

          <Route path={ROUTES.setup} element={<SetupPage />} />

          <Route
            path="/"
            element={
              <RequireAuth>
                <Navigation>
                  <TableSettingsDialog />
                </Navigation>
              </RequireAuth>
            }
          >
            <Route
              path={ROUTES.home}
              element={<Navigate to={ROUTES.tables} replace />}
            />
            <Route path={ROUTES.tables} element={<TablesPage />} />

            <Route
              path={ROUTES.settings}
              element={<Navigate to={ROUTES.userSettings} replace />}
            />
            <Route path={ROUTES.userSettings} element={<UserSettingsPage />} />
            <Route
              path={ROUTES.projectSettings}
              element={<ProjectSettingsPage />}
            />
            <Route
              path={ROUTES.userManagement}
              element={<UserManagementPage />}
            />
            {/* <Route path={ROUTES.rowyRunTest} element={<RowyRunTestPage />} /> */}

            <Route path="/jotaiTest" element={<JotaiTestPage />} />
          </Route>

          {/* <Route path="/jotaiTest" element={<JotaiTestPage />} /> */}
        </Routes>
      )}
    </Suspense>
  );
}
