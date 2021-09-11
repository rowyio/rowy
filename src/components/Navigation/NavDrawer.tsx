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
import CloseIcon from "assets/icons/Backburger";

import { APP_BAR_HEIGHT } from ".";
import Logo from "assets/Logo";
import NavItem from "./NavItem";
import NavTableSection from "./NavTableSection";

import { useAppContext } from "contexts/AppContext";
import { useProjectContext } from "contexts/ProjectContext";
import { routes } from "constants/routes";

export const NAV_DRAWER_WIDTH = 256;

export interface INavDrawerProps extends DrawerProps {
  currentSection?: string;
  onClose: NonNullable<DrawerProps["onClose"]>;
}

export default function NavDrawer({
  currentSection,
  ...props
}: INavDrawerProps) {
  const { userDoc } = useAppContext();
  const { userClaims, tables } = useProjectContext();

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
      {...props}
      sx={{ "& .MuiDrawer-paper": { minWidth: NAV_DRAWER_WIDTH } }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ height: APP_BAR_HEIGHT, flexShrink: 0, pl: 0.5 }}
      >
        <IconButton
          aria-label="Close navigation drawer"
          onClick={props.onClose as any}
          size="large"
        >
          <CloseIcon />
        </IconButton>

        <Logo />
      </Stack>

      <nav>
        <List disablePadding>
          <li>
            <NavItem to={routes.home} onClick={closeDrawer}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </NavItem>
          </li>
          <li>
            <NavItem to={routes.userSettings} onClick={closeDrawer}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </NavItem>
          </li>
          {userClaims?.roles?.includes("ADMIN") && (
            <li>
              <NavItem to={routes.projectSettings} onClick={closeDrawer}>
                <ListItemIcon>
                  <ProjectSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Project Settings" />
              </NavItem>
            </li>
          )}
          {userClaims?.roles?.includes("ADMIN") && (
            <li>
              <NavItem to={routes.userManagement} onClick={closeDrawer}>
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
                  closeDrawer={closeDrawer}
                />
              ))}
        </List>
      </nav>
    </Drawer>
  );
}
