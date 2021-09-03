import { useLocation } from "react-router-dom";

import {
  Drawer,
  DrawerProps,
  Stack,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import SettingsIcon from "@material-ui/icons/SettingsOutlined";
import ProjectSettingsIcon from "@material-ui/icons/BuildCircleOutlined";
import UserManagementIcon from "@material-ui/icons/AccountCircleOutlined";
import CloseIcon from "assets/icons/Backburger";

import { APP_BAR_HEIGHT } from ".";
import Logo from "assets/Logo";
import NavItem from "./NavItem";
import NavTableSection from "./NavTableSection";

import { useRowyContext } from "contexts/RowyContext";
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
  const { userClaims, sections } = useRowyContext();

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
        sx={{ height: APP_BAR_HEIGHT, pl: 0.5 }}
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
            Object.entries(sections).map(([section, tables]) => (
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
