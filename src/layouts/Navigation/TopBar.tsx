import { useAtom } from "jotai";
import { colord } from "colord";
import { NavLink } from "react-router-dom";

import {
  useScrollTrigger,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Typography,
  Grow,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuCloseIcon from "@mui/icons-material/MenuOpen";
import PersonAddIcon from "@mui/icons-material/PersonAddOutlined";

import Logo from "@src/assets/Logo";
import { NAV_DRAWER_WIDTH, NAV_DRAWER_COLLAPSED_WIDTH } from "./NavDrawer";
import UserMenu from "./UserMenu";
import UpdateCheckBadge from "./UpdateCheckBadge";

import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import { ROUTES, ROUTE_TITLES } from "@src/constants/routes";

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
  const [userRoles] = useAtom(userRolesAtom, projectScope);

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const menuIcon = open ? <MenuCloseIcon /> : <MenuIcon />;

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={trigger ? 1 : 0}
      sx={{
        height: TOP_BAR_HEIGHT,
        backgroundColor: trigger
          ? (theme) =>
              colord(theme.palette.background.paper)
                .mix("#fff", 0.09) // Elevation 8
                .alpha(1)
                .toHslString()
          : "transparent",
        transitionProperty: "box-shadow, background-color",
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
                scrollbarWidth: "thin",
                userSelect: "none",
                ml: 1,
              },
              !(routeTitle as any)?.leftAligned && {
                ml: { xs: 1, sm: 40 / 8 + 1, md: 208 / 8 + 1 },
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

        <Button
          component={NavLink}
          to={ROUTES.members}
          startIcon={<PersonAddIcon />}
          sx={{
            minWidth: 40,
            "&&": { px: { xs: 1, md: 2 } },
            mr: 1,
            "&.active": { visibility: "hidden" },

            "& .text": { display: { xs: "none", md: "inline" } },
            "& .MuiButton-startIcon": { mr: { xs: 0, md: 1 } },
          }}
        >
          <span className="text">Invite team members</span>
        </Button>

        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
