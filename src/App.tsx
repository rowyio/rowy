import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAtom } from "jotai";

import Loading from "@src/components/Loading";
import ProjectSourceFirebase from "@src/sources/ProjectSourceFirebase";
import MembersSourceFirebase from "@src/sources/MembersSourceFirebase";
import ConfirmDialog from "@src/components/ConfirmDialog";
import RowyRunModal from "@src/components/RowyRunModal";
import NotFound from "@src/pages/NotFoundPage";
import RequireAuth from "@src/layouts/RequireAuth";

import {
  projectScope,
  currentUserAtom,
  userRolesAtom,
  altPressAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import useKeyPressWithAtom from "@src/hooks/useKeyPressWithAtom";

import TableGroupRedirectPage from "./pages/TableGroupRedirectPage";
import JotaiTestPage from "@src/pages/Test/JotaiTestPage";
import SignOutPage from "@src/pages/Auth/SignOutPage";

// prettier-ignore
const AuthPage = lazy(() => import("@src/pages/Auth/AuthPage" /* webpackChunkName: "AuthPage" */));
// prettier-ignore
const SignUpPage = lazy(() => import("@src/pages/Auth/SignUpPage" /* webpackChunkName: "SignUpPage" */));
// prettier-ignore
const JwtAuthPage = lazy(() => import("@src/pages/Auth/JwtAuthPage" /* webpackChunkName: "JwtAuthPage" */));
// prettier-ignore
const ImpersonatorAuthPage = lazy(() => import("@src/pages/Auth/ImpersonatorAuthPage" /* webpackChunkName: "ImpersonatorAuthPage" */));

// prettier-ignore
const SetupPage = lazy(() => import("@src/pages/SetupPage" /* webpackChunkName: "SetupPage" */));

// prettier-ignore
const Navigation = lazy(() => import("@src/layouts/Navigation" /* webpackChunkName: "Navigation" */));
// prettier-ignore
const TableSettingsDialog = lazy(() => import("@src/components/TableSettingsDialog" /* webpackChunkName: "TableSettingsDialog" */));

// prettier-ignore
const TablesPage = lazy(() => import("@src/pages/TablesPage" /* webpackChunkName: "TablesPage" */));
// prettier-ignore
const ProvidedTablePage = lazy(() => import("@src/pages/Table/ProvidedTablePage" /* webpackChunkName: "ProvidedTablePage" */));
// prettier-ignore
const ProvidedSubTablePage = lazy(() => import("@src/pages/Table/ProvidedSubTablePage" /* webpackChunkName: "ProvidedSubTablePage" */));
// prettier-ignore
const TableTutorialPage = lazy(() => import("@src/pages/Table/TableTutorialPage" /* webpackChunkName: "TableTutorialPage" */));

// prettier-ignore
const FunctionPage = lazy(() => import("@src/pages/FunctionPage" /* webpackChunkName: "FunctionPage" */));
// prettier-ignore
const UserSettingsPage = lazy(() => import("@src/pages/Settings/UserSettingsPage" /* webpackChunkName: "UserSettingsPage" */));
// prettier-ignore
const ProjectSettingsPage = lazy(() => import("@src/pages/Settings/ProjectSettingsPage" /* webpackChunkName: "ProjectSettingsPage" */));
// prettier-ignore
const MembersPage = lazy(() => import("@src/pages/Settings/MembersPage" /* webpackChunkName: "MembersPage" */));
// prettier-ignore
const DebugSettingsPage = lazy(() => import("@src/pages/Settings/DebugSettingsPage" /* webpackChunkName: "DebugSettingsPage" */));

// prettier-ignore
const ThemeTestPage = lazy(() => import("@src/pages/Test/ThemeTestPage" /* webpackChunkName: "ThemeTestPage" */));
// const RowyRunTestPage = lazy(() => import("@src/pages/RowyRunTestPage" /* webpackChunkName: "RowyRunTestPage" */));

export default function App() {
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  useKeyPressWithAtom("Alt", altPressAtom, projectScope);

  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ProjectSourceFirebase />
      {userRoles.includes("ADMIN") && <MembersSourceFirebase />}
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

            <Route path={ROUTES.table}>
              <Route index element={<Navigate to={ROUTES.tables} replace />} />
              <Route path=":id" element={<ProvidedTablePage />}>
                <Route path={ROUTES.subTable}>
                  <Route index element={<NotFound />} />
                  <Route
                    path=":docPath/:subTableKey"
                    element={<ProvidedSubTablePage />}
                  />
                </Route>
              </Route>
            </Route>

            <Route path={ROUTES.tableGroup}>
              <Route index element={<Navigate to={ROUTES.tables} replace />} />
              <Route path=":id" element={<TableGroupRedirectPage />} />
            </Route>

            <Route
              path={ROUTES.tableTutorial}
              element={<TableTutorialPage />}
            />

            <Route path={ROUTES.function}>
              <Route
                index
                element={<Navigate to={ROUTES.functions} replace />}
              />
              <Route path=":id" element={<FunctionPage />} />
            </Route>
            <Route
              path={ROUTES.settings}
              element={<Navigate to={ROUTES.userSettings} replace />}
            />
            <Route path={ROUTES.userSettings} element={<UserSettingsPage />} />
            <Route
              path={ROUTES.projectSettings}
              element={<ProjectSettingsPage />}
            />
            <Route path={ROUTES.members} element={<MembersPage />} />
            <Route
              path={ROUTES.debugSettings}
              element={<DebugSettingsPage />}
            />
            {/* <Route path={ROUTES.rowyRunTest} element={<RowyRunTestPage />} /> */}

            <Route path="/test/jotai" element={<JotaiTestPage />} />
          </Route>

          <Route path={ROUTES.themeTest} element={<ThemeTestPage />} />
        </Routes>
      )}
    </Suspense>
  );
}
