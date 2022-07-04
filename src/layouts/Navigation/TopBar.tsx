import { useAtom } from "jotai";

import {
  useScrollTrigger,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Grow,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuCloseIcon from "@mui/icons-material/MenuOpen";

import Logo from "@src/assets/Logo";
import { NAV_DRAWER_WIDTH, NAV_DRAWER_COLLAPSED_WIDTH } from "./NavDrawer";
import HelpMenu from "./HelpMenu";
import UserMenu from "./UserMenu";
import UpdateCheckBadge from "./UpdateCheckBadge";

import { globalScope, userRolesAtom } from "@src/atoms/globalScope";
import { ROUTE_TITLES } from "@src/constants/routes";

export const TOP_BAR_HEIGHT = 56;

export interface ITopBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isPermanent: boolean;
  routeTitle: typeof ROUTE_TITLES[keyof typeof ROUTE_TITLES];
  title: string;
}

export default function TopBar({
  open,
  setOpen,
  isPermanent,
  routeTitle,
  title,
}: ITopBarProps) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const menuIcon = open ? <MenuCloseIcon /> : <MenuIcon />;

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={trigger ? 1 : 0}
      sx={{
        height: TOP_BAR_HEIGHT,
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))", // Elevation 8

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

          transitionProperty: "opacity",
          transitionTimingFunction: "var(--nav-transition-timing-function)",
          transitionDuration: "var(--nav-transition-duration)",
        },
      }}
    >
      <Toolbar
        sx={{
          height: TOP_BAR_HEIGHT,
          minWidth: 0,
          maxWidth: "none",
          "&&": {
            minHeight: TOP_BAR_HEIGHT,
            p: 0,
            pl: (theme) =>
              `max(env(safe-area-inset-left), ${theme.spacing(0.5)})`,
            pr: (theme) =>
              `max(env(safe-area-inset-right), ${theme.spacing(0.5)})`,
          },
        }}
      >
        <Grow in>
          <IconButton
            aria-label={`${open ? "Close" : "Open"} navigation drawer`}
            onClick={() => setOpen(!open)}
            size="large"
          >
            {userRoles.includes("ADMIN") ? (
              <UpdateCheckBadge>{menuIcon}</UpdateCheckBadge>
            ) : (
              menuIcon
            )}
          </IconButton>
        </Grow>

        {isPermanent && (
          <Box
            sx={{
              width: open ? NAV_DRAWER_WIDTH : NAV_DRAWER_COLLAPSED_WIDTH,
              height: 2,

              transform: `scale(${open ? 1 : 0})`,
              transformOrigin: "0% 50%",
              opacity: open ? 1 : 0,

              transitionProperty: "width, opacity, transform",
              transitionTimingFunction: "var(--nav-transition-timing-function)",
              transitionDuration: "var(--nav-transition-duration)",

              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <Logo />
          </Box>
        )}

        <Fade
          in
          key={title}
          {...(typeof routeTitle !== "string"
            ? routeTitle.titleTransitionProps
            : undefined)}
        >
          <Box
            sx={[
              {
                flex: 1,
                overflowX: "auto",
                userSelect: "none",
                ml: 1,
              },
              !(routeTitle as any)?.leftAligned && {
                ml: { xs: 1, sm: 6 },
              },
              isPermanent &&
                (routeTitle as any)?.leftAligned && {
                  ml: -NAV_DRAWER_COLLAPSED_WIDTH / 8 + 0.5 + 2,
                },
            ]}
          >
            {typeof routeTitle !== "string" ? (
              routeTitle.titleComponent(open, isPermanent)
            ) : (
              <Typography
                variant="h6"
                component="h1"
                noWrap
                sx={{
                  flexShrink: 0,
                  flexGrow: 1,
                  typography: { sm: "h5" },
                  textAlign: { xs: "left", sm: "center" },
                }}
              >
                {title}
              </Typography>
            )}
          </Box>
        </Fade>

        <HelpMenu />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
