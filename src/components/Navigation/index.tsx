import { ReactNode, useState, Suspense } from "react";

import {
  useScrollTrigger,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Grow,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import NavDrawer from "./NavDrawer";
import UserMenu from "./UserMenu";
import ErrorBoundary from "components/ErrorBoundary";
import Loading from "components/Loading";

import { name } from "@root/package.json";
import { projectId } from "@src/firebase";

export const APP_BAR_HEIGHT = 56;

export interface INavigationProps {
  children: ReactNode;
  title: string;
  titleComponent?: ReactNode;
  currentSection?: string;
}

export default function Navigation({
  children,
  title,
  titleComponent,
  currentSection,
}: INavigationProps) {
  const [open, setOpen] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  document.title = `${title} • ${projectId} • ${name}`;

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
              pl: 2,
              pr: 2,
            },
          }}
        >
          <Grow in>
            <IconButton
              aria-label="Open navigation drawer"
              onClick={() => setOpen(true)}
              size="large"
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </Grow>

          <Grow in key={title}>
            <Box sx={{ flex: 1, userSelect: "none" }}>
              {titleComponent || (
                <Typography variant="h6" component="h1" textAlign="center">
                  {title}
                </Typography>
              )}
            </Box>
          </Grow>

          <UserMenu />
          {/* <Notifications /> */}
        </Toolbar>
      </AppBar>

      <NavDrawer
        open={open}
        onClose={() => setOpen(false)}
        currentSection={currentSection}
      />

      <ErrorBoundary style={{ marginTop: -APP_BAR_HEIGHT }}>
        <Suspense
          fallback={
            <Loading fullScreen style={{ marginTop: -APP_BAR_HEIGHT }} />
          }
        >
          {children}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
