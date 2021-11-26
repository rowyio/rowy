import _find from "lodash/find";
import _groupBy from "lodash/groupBy";

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
import HomeIcon from "@mui/icons-material/HomeOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import ProjectSettingsIcon from "@mui/icons-material/BuildCircleOutlined";
import UserManagementIcon from "@mui/icons-material/AccountCircleOutlined";
import CloseIcon from "@mui/icons-material/MenuOpen";
import PinIcon from "@mui/icons-material/PushPinOutlined";
import UnpinIcon from "@mui/icons-material/PushPin";

import { APP_BAR_HEIGHT } from ".";
import Logo from "@src/assets/Logo";
import NavItem from "./NavItem";
import NavTableSection from "./NavTableSection";
import UpdateCheckBadge from "./UpdateCheckBadge";

import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { routes } from "@src/constants/routes";

export const NAV_DRAWER_WIDTH = 256;

export interface INavDrawerProps extends DrawerProps {
  currentSection?: string;
  onClose: NonNullable<DrawerProps["onClose"]>;
  pinned: boolean;
  setPinned: React.Dispatch<React.SetStateAction<boolean>>;
  canPin: boolean;
}

export default function NavDrawer({
  open,
  currentSection,
  pinned,
  setPinned,
  canPin,
  ...props
}: INavDrawerProps) {
  const { userDoc, userClaims } = useAppContext();
  const { tables } = useProjectContext();

  const favorites = Array.isArray(userDoc.state.doc?.favoriteTables)
    ? userDoc.state.doc.favoriteTables
    : [];
  const sections = {
    Favorites: favorites.map((id) => _find(tables, { id })),
    ..._groupBy(tables, "section"),
  };

  const closeDrawer = (e: {}) => props.onClose(e, "escapeKeyDown");

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
            <NavItem
              to={routes.home}
              onClick={pinned ? undefined : closeDrawer}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </NavItem>
          </li>
          <li>
            <NavItem
              to={routes.userSettings}
              onClick={pinned ? undefined : closeDrawer}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </NavItem>
          </li>
          {userClaims?.roles?.includes("ADMIN") && (
            <li>
              <NavItem
                to={routes.projectSettings}
                onClick={pinned ? undefined : closeDrawer}
              >
                <ListItemIcon>
                  <ProjectSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Project Settings" />
                <UpdateCheckBadge sx={{ mr: 1.5 }} />
              </NavItem>
            </li>
          )}
          {userClaims?.roles?.includes("ADMIN") && (
            <li>
              <NavItem
                to={routes.userManagement}
                onClick={pinned ? undefined : closeDrawer}
              >
                <ListItemIcon>
                  <UserManagementIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </NavItem>
            </li>
          )}

          <Divider variant="middle" sx={{ my: 1 }} />

          {sections &&
            Object.entries(sections)
              .filter(([, tables]) => tables.length > 0)
              .map(([section, tables]) => (
                <NavTableSection
                  key={section}
                  section={section}
                  tables={tables}
                  currentSection={currentSection}
                  closeDrawer={pinned ? undefined : closeDrawer}
                />
              ))}
        </List>
      </nav>
    </Drawer>
  );
}
