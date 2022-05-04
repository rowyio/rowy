import React, { Suspense } from "react";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, Outlet } from "react-router-dom";

import {
  useScrollTrigger,
  useMediaQuery,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Grow,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import NavDrawer, { NAV_DRAWER_WIDTH } from "./NavDrawer";
import UserMenu from "./UserMenu";
import ErrorFallback, {
  IErrorFallbackProps,
} from "@src/components/ErrorFallback";
import Loading from "@src/components/Loading";
import UpdateCheckBadge from "./UpdateCheckBadge";

import {
  globalScope,
  projectIdAtom,
  userRolesAtom,
  navOpenAtom,
  navPinnedAtom,
} from "@src/atoms/globalScope";
import { ROUTE_TITLES } from "@src/constants/routes";
import { useDocumentTitle } from "@src/hooks/useDocumentTitle";

export const APP_BAR_HEIGHT = 56;
const StyledErrorFallback = (props: IErrorFallbackProps) => (
  <ErrorFallback {...props} style={{ marginTop: -APP_BAR_HEIGHT }} />
);

export default function Navigation({ children }: React.PropsWithChildren<{}>) {
  const [projectId] = useAtom(projectIdAtom, globalScope);
  const [userRoles] = useAtom(userRolesAtom, globalScope);

  const [open, setOpen] = useAtom(navOpenAtom, globalScope);
  const [pinned, setPinned] = useAtom(navPinnedAtom, globalScope);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const canPin = !useMediaQuery((theme: any) => theme.breakpoints.down("lg"));

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
      <AppBar
        position="sticky"
        color="inherit"
        elevation={trigger ? 1 : 0}
        sx={{
          height: APP_BAR_HEIGHT, // Elevation 8
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",

          "&::before": {
            content: "''",
            display: "block",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,

            bgcolor: "background.default",
            opacity: trigger ? 0 : 1,
            transition: (theme) => theme.transitions.create("opacity"),
          },

          pl: canPin && pinned && open ? `${NAV_DRAWER_WIDTH}px` : 0,
          transition: (theme) =>
            theme.transitions.create("padding-left", {
              easing:
                canPin && pinned
                  ? theme.transitions.easing.easeOut
                  : theme.transitions.easing.sharp,
              duration:
                canPin && pinned
                  ? theme.transitions.duration.enteringScreen
                  : theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar
          sx={{
            height: APP_BAR_HEIGHT,
            minWidth: 0,
            maxWidth: "none",
            "&&": {
              minHeight: APP_BAR_HEIGHT,
              p: 0,
              pl: (theme) =>
                `max(env(safe-area-inset-left), ${theme.spacing(2)})`,
              pr: (theme) =>
                `max(env(safe-area-inset-right), ${theme.spacing(2)})`,
            },
          }}
        >
          {!(open && canPin && pinned) && (
            <Grow in>
              <IconButton
                aria-label="Open navigation drawer"
                onClick={() => setOpen(true)}
                size="large"
                edge="start"
              >
                {userRoles.includes("ADMIN") ? (
                  <UpdateCheckBadge>
                    <MenuIcon />
                  </UpdateCheckBadge>
                ) : (
                  <MenuIcon />
                )}
              </IconButton>
            </Grow>
          )}

          <Grow
            in
            key={title}
            {...(typeof routeTitle !== "string"
              ? routeTitle.titleTransitionProps
              : undefined)}
          >
            <Box
              sx={{
                flex: 1,
                overflowX: "auto",
                userSelect: "none",
                pl: open && canPin && pinned ? 48 / 8 : 0,
              }}
            >
              {typeof routeTitle !== "string" ? (
                routeTitle.titleComponent(open, canPin && pinned)
              ) : (
                <Typography
                  variant="h6"
                  component="h1"
                  textAlign="center"
                  sx={{ typography: { sm: "h5" } }}
                >
                  {title}
                </Typography>
              )}
            </Box>
          </Grow>

          <UserMenu />
        </Toolbar>
      </AppBar>

      <Stack direction="row">
        <NavDrawer
          open={open}
          pinned={canPin && pinned}
          setPinned={setPinned}
          canPin={canPin}
          onClose={() => setOpen(false)}
        />

        <ErrorBoundary FallbackComponent={StyledErrorFallback}>
          <Suspense
            fallback={
              <Loading fullScreen style={{ marginTop: -APP_BAR_HEIGHT }} />
            }
          >
            <div
              style={{
                flexGrow: 1,
                maxWidth:
                  canPin && pinned && open
                    ? `calc(100% - ${NAV_DRAWER_WIDTH}px)`
                    : "100%",
              }}
            >
              <Outlet />
              {children}
            </div>
          </Suspense>
        </ErrorBoundary>
      </Stack>
    </>
  );
}
