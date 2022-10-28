import React, { Suspense } from "react";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, Outlet } from "react-router-dom";

import { useMediaQuery, Stack, GlobalStyles } from "@mui/material";

import TopBar, { TOP_BAR_HEIGHT } from "./TopBar";
import NavDrawer from "./NavDrawer";
import NavDrawerContents from "./NavDrawer/NavDrawerContents";
import ErrorFallback, {
  IErrorFallbackProps,
} from "@src/components/ErrorFallback";
import Loading from "@src/components/Loading";
import GetStartedChecklist from "@src/components/GetStartedChecklist";

import {
  projectScope,
  projectIdAtom,
  navOpenAtom,
} from "@src/atoms/projectScope";
import { ROUTE_TITLES } from "@src/constants/routes";
import { useDocumentTitle } from "@src/hooks/useDocumentTitle";

export default function Navigation({ children }: React.PropsWithChildren<{}>) {
  const [projectId] = useAtom(projectIdAtom, projectScope);

  const [open, setOpen] = useAtom(navOpenAtom, projectScope);
  const isPermanent = useMediaQuery((theme: any) => theme.breakpoints.up("md"));

  const { pathname } = useLocation();
  const basePath = ("/" + pathname.split("/")[1]) as keyof typeof ROUTE_TITLES;
  const routeTitle =
    ROUTE_TITLES[pathname as keyof typeof ROUTE_TITLES] ||
    ROUTE_TITLES[basePath] ||
    "";
  const title = typeof routeTitle === "string" ? routeTitle : routeTitle.title;
  useDocumentTitle(projectId, title);

  return (
    <>
      <TopBar
        open={open}
        setOpen={setOpen}
        isPermanent={isPermanent}
        routeTitle={routeTitle}
        title={title}
      />

      <Stack direction="row">
        <NavDrawer
          open={open}
          isPermanent={isPermanent}
          onClose={() => setOpen(false)}
          Contents={NavDrawerContents}
        />
        <GetStartedChecklist navOpen={open} navPermanent={isPermanent} />

        <ErrorBoundary FallbackComponent={StyledErrorFallback}>
          <Suspense
            fallback={
              <Loading fullScreen style={{ marginTop: -TOP_BAR_HEIGHT }} />
            }
          >
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <Outlet />
              {children}
            </div>
          </Suspense>
        </ErrorBoundary>
      </Stack>

      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--nav-transition-timing-function": open
              ? theme.transitions.easing.easeOut
              : theme.transitions.easing.sharp,
            "--nav-transition-duration":
              (open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen) + "ms",
          },
        })}
      />
    </>
  );
}

const StyledErrorFallback = (props: IErrorFallbackProps) => (
  <ErrorFallback {...props} style={{ marginTop: -TOP_BAR_HEIGHT }} />
);
