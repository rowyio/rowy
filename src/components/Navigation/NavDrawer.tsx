import { Link } from "react-router-dom";

import {
  Drawer,
  DrawerProps,
  Stack,
  IconButton,
  List,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import SettingsIcon from "@material-ui/icons/SettingsOutlined";
import ProjectSettingsIcon from "assets/icons/ProjectSettings";
import CloseIcon from "assets/icons/Backburger";

import { APP_BAR_HEIGHT } from ".";
import Logo from "assets/Logo";
import NavDrawerItem from "./NavDrawerItem";

import { useRowyContext } from "contexts/RowyContext";
import { routes } from "constants/routes";

export const NAV_DRAWER_WIDTH = 256;

export interface INavDrawerProps extends DrawerProps {
  currentSection?: string;
  currentTable?: string;
  onClose: NonNullable<DrawerProps["onClose"]>;
}

export default function NavDrawer({
  currentSection,
  currentTable = "",
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
            <MenuItem component={Link} to={routes.home} onClick={closeDrawer}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </MenuItem>
          </li>
          <li>
            <MenuItem
              component={Link}
              to={routes.settings}
              onClick={closeDrawer}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
          </li>
          {userClaims?.roles?.includes("ADMIN") && (
            <li>
              <MenuItem
                component={Link}
                to={routes.projectSettings}
                onClick={closeDrawer}
              >
                <ListItemIcon>
                  <ProjectSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Project Settings" />
              </MenuItem>
            </li>
          )}

          <Divider variant="middle" sx={{ mt: 1, mb: 1 }} />

          {sections &&
            Object.entries(sections).map(([section, tables]) => (
              <NavDrawerItem
                key={section}
                section={section}
                tables={tables}
                currentSection={currentSection}
                currentTable={currentTable}
                closeDrawer={closeDrawer}
              />
            ))}
        </List>
      </nav>
    </Drawer>
  );
}
