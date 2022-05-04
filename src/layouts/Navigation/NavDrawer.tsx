import { useAtom, useSetAtom } from "jotai";
import { find, groupBy } from "lodash-es";

import {
  Drawer,
  DrawerProps,
  Stack,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/MenuOpen";
import PinIcon from "@mui/icons-material/PushPinOutlined";
import UnpinIcon from "@mui/icons-material/PushPin";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import ProjectSettingsIcon from "@mui/icons-material/BuildCircleOutlined";
import UserManagementIcon from "@mui/icons-material/AccountCircleOutlined";
import AddIcon from "@mui/icons-material/Add";

import { APP_BAR_HEIGHT } from ".";
import Logo from "@src/assets/Logo";
import NavItem from "./NavItem";
import NavTableSection from "./NavTableSection";
import UpdateCheckBadge from "./UpdateCheckBadge";

import {
  globalScope,
  userRolesAtom,
  userSettingsAtom,
  tablesAtom,
  tableSettingsDialogAtom,
} from "@src/atoms/globalScope";
import { TableSettings } from "@src/types/table";
import { ROUTES } from "@src/constants/routes";

export const NAV_DRAWER_WIDTH = 256;

export interface INavDrawerProps extends DrawerProps {
  onClose: NonNullable<DrawerProps["onClose"]>;
  pinned: boolean;
  setPinned: React.Dispatch<React.SetStateAction<boolean>>;
  canPin: boolean;
}

export default function NavDrawer({
  open,
  pinned,
  setPinned,
  canPin,
  ...props
}: INavDrawerProps) {
  const [tables] = useAtom(tablesAtom, globalScope);
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    globalScope
  );

  const favorites = Array.isArray(userSettings.favoriteTables)
    ? userSettings.favoriteTables
    : [];
  const sections = {
    Favorites: favorites
      .map((id) => find(tables, { id }))
      .filter((x) => x !== undefined) as TableSettings[],
    ...groupBy(tables, "section"),
  };

  const closeDrawer = pinned
    ? undefined
    : (e: {}) => props.onClose(e, "escapeKeyDown");

  return (
    <Drawer
      open={open}
      {...props}
      variant={pinned ? "persistent" : "temporary"}
      anchor="left"
      sx={{
        width: open ? NAV_DRAWER_WIDTH : 0,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: pinned
              ? theme.transitions.easing.easeOut
              : theme.transitions.easing.sharp,
            duration: pinned
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),

        flexShrink: 0,

        "& .MuiDrawer-paper": {
          minWidth: NAV_DRAWER_WIDTH,
          bgcolor: pinned ? "background.default" : "background.paper",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          height: APP_BAR_HEIGHT,
          flexShrink: 0,
          px: 0.5,

          position: "sticky",
          top: 0,
          zIndex: "appBar",
          backgroundColor: "inherit",
          backgroundImage: "inherit",
        }}
      >
        <IconButton
          aria-label="Close navigation drawer"
          onClick={props.onClose as any}
          size="large"
        >
          <CloseIcon />
        </IconButton>

        <Logo style={{ marginLeft: 1 }} />

        {canPin && (
          <IconButton
            aria-label="Pin navigation drawer"
            onClick={() => setPinned((p) => !p)}
            aria-pressed={pinned}
            size="large"
            style={{ marginLeft: "auto" }}
          >
            {pinned ? <UnpinIcon /> : <PinIcon />}
          </IconButton>
        )}
      </Stack>

      <nav>
        <List disablePadding>
          <li>
            <NavItem to={ROUTES.tables} onClick={closeDrawer}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </NavItem>
          </li>

          {userRoles.includes("ADMIN") && (
            <Divider variant="middle" sx={{ my: 1 }} />
          )}

          <li>
            <NavItem to={ROUTES.userSettings} onClick={closeDrawer}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </NavItem>
          </li>
          {userRoles.includes("ADMIN") && (
            <li>
              <NavItem to={ROUTES.projectSettings} onClick={closeDrawer}>
                <ListItemIcon>
                  <ProjectSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Project Settings" />
                <UpdateCheckBadge sx={{ mr: 1.5 }} />
              </NavItem>
            </li>
          )}
          {userRoles.includes("ADMIN") && (
            <li>
              <NavItem to={ROUTES.userManagement} onClick={closeDrawer}>
                <ListItemIcon>
                  <UserManagementIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </NavItem>
            </li>
          )}

          <Divider variant="middle" sx={{ my: 1 }} />

          <li>
            <NavItem
              {...({ component: "button" } as any)}
              style={{ textAlign: "left" }}
              onClick={(e) => {
                if (closeDrawer) closeDrawer(e);
                openTableSettingsDialog({});
              }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Create table…" />
            </NavItem>
          </li>

          <Divider variant="middle" sx={{ my: 1 }} />

          {sections &&
            Object.entries(sections)
              .filter(([, tables]) => tables.length > 0)
              .map(([section, tables]) => (
                <NavTableSection
                  key={section}
                  section={section}
                  tables={tables}
                  closeDrawer={closeDrawer}
                />
              ))}
        </List>
      </nav>
    </Drawer>
  );
}
