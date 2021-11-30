import { ReactNode, Suspense } from "react";
import createPersistedState from "use-persisted-state";

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
  GrowProps,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import NavDrawer, { NAV_DRAWER_WIDTH } from "./NavDrawer";
import UserMenu from "./UserMenu";
import ErrorBoundary from "@src/components/ErrorBoundary";
import Loading from "@src/components/Loading";
import UpdateCheckBadge from "./UpdateCheckBadge";

import { useAppContext } from "@src/contexts/AppContext";
import useDocumentTitle from "@src/hooks/useDocumentTitle";

export const APP_BAR_HEIGHT = 56;

const useOpenState = createPersistedState("__ROWY__NAV_OPEN");
const usePinnedState = createPersistedState("__ROWY__NAV_PINNED");

export interface INavigationProps {
  children: ReactNode;
  title: string;
  titleComponent?: (open: boolean, pinned: boolean) => ReactNode;
  currentSection?: string;
  titleTransitionProps?: Partial<GrowProps>;
}

export default function Navigation({
  children,
  title,
  titleComponent,
  currentSection,
  titleTransitionProps,
}: INavigationProps) {
  const { projectId, userRoles } = useAppContext();
  useDocumentTitle(projectId, title);

  const [open, setOpen] = useOpenState(false);
  const [pinned, setPinned] = usePinnedState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const canPin = !useMediaQuery((theme: any) => theme.breakpoints.down("lg"));

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

          <Grow in key={title} {...titleTransitionProps}>
            <Box
              sx={{
                flex: 1,
                overflowX: "auto",
                userSelect: "none",
                pl: open && canPin && pinned ? 48 / 8 : 0,
              }}
            >
              {titleComponent ? (
                titleComponent(open, canPin && pinned)
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
          {/* <Notifications /> */}
        </Toolbar>
      </AppBar>

      <Stack direction="row">
        <NavDrawer
          open={open}
          pinned={canPin && pinned}
          setPinned={setPinned}
          canPin={canPin}
          onClose={() => setOpen(false)}
          currentSection={currentSection}
        />

        <ErrorBoundary style={{ marginTop: -APP_BAR_HEIGHT }}>
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
              {children}
            </div>
          </Suspense>
        </ErrorBoundary>
      </Stack>
    </>
  );
}
