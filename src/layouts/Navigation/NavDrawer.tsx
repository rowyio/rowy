import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { find, groupBy } from "lodash-es";
import { colord } from "colord";

import {
  Drawer,
  DrawerProps,
  Stack,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  ListItemSecondaryAction,
  Box,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/MenuOpen";
import ArrowBackIcon from "@mui/icons-material/WorkspacesOutlined";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import ProjectSettingsIcon from "@mui/icons-material/BuildCircleOutlined";
import UserManagementIcon from "@mui/icons-material/AccountCircleOutlined";
import AddIcon from "@mui/icons-material/Add";
import { Table as TableIcon } from "@src/assets/icons";
import DocsIcon from "@mui/icons-material/LibraryBooksOutlined";
import LearningIcon from "@mui/icons-material/LocalLibraryOutlined";
import HelpIcon from "@mui/icons-material/HelpOutline";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

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
import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";
import { TOP_BAR_HEIGHT } from "./TopBar";

export const NAV_DRAWER_WIDTH = 256;
export const NAV_DRAWER_COLLAPSED_WIDTH = 56;

export interface INavDrawerProps extends DrawerProps {
  open: boolean;
  isPermanent: boolean;
  onClose: NonNullable<DrawerProps["onClose"]>;
}

export default function NavDrawer({
  open,
  isPermanent,
  onClose,
}: INavDrawerProps) {
  const [tables] = useAtom(tablesAtom, globalScope);
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    globalScope
  );

  const [hover, setHover] = useState(false);

  const favorites = Array.isArray(userSettings.favoriteTables)
    ? userSettings.favoriteTables
    : [];
  const sections = {
    Favorites: favorites
      .map((id) => find(tables, { id }))
      .filter((x) => x !== undefined) as TableSettings[],
    ...groupBy(tables, "section"),
  };

  const collapsed = !open && isPermanent;
  const tempExpanded = hover && collapsed;
  const width =
    collapsed && !tempExpanded ? NAV_DRAWER_COLLAPSED_WIDTH : NAV_DRAWER_WIDTH;
  const closeDrawer = isPermanent
    ? undefined
    : (e: {}) => onClose(e, "escapeKeyDown");

  const externalLinkIcon = !collapsed && (
    <ListItemSecondaryAction sx={{ right: 10, color: "text.disabled" }}>
      <InlineOpenInNewIcon />
    </ListItemSecondaryAction>
  );

  return (
    <>
      <Drawer
        open={isPermanent || open}
        onClose={onClose}
        hideBackdrop={isPermanent}
        ModalProps={{ disablePortal: true }}
        variant={isPermanent ? "permanent" : "temporary"}
        anchor="left"
        sx={[
          {
            width,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width,
              pt: 0,
              pb: 1,
              scrollbarWidth: "thin",
            },
          },
          isPermanent && {
            position: "fixed",
            zIndex: (theme) => theme.zIndex.appBar - 1,

            "& .MuiDrawer-paper": {
              mt: `${TOP_BAR_HEIGHT - 4}px`,
              height: `calc(100% - ${TOP_BAR_HEIGHT - 4}px)`,
              pt: 0.5,
              borderRadius: 2,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,

              width,
              transitionProperty:
                "width, transform, background-color, box-shadow",
              transitionTimingFunction: "var(--nav-transition-timing-function)",
              transitionDuration: "var(--nav-transition-duration)",
              overflowX: "hidden",

              borderRight: "none",
              bgcolor: "background.default",
            },

            "& .MuiListItemSecondaryAction-root": {
              transitionProperty: "opacity",
              transitionTimingFunction: "var(--nav-transition-timing-function)",
              transitionDuration: "var(--nav-transition-duration)",
            },
          },
          collapsed &&
            !tempExpanded && {
              "& .MuiDrawer-paper": {
                scrollbarWidth: "none",
                "::-webkit-scrollbar": { display: "none" },
              },
              "& .MuiListItemSecondaryAction-root": {
                opacity: 0,
                transitionDelay: "0ms",
              },
            },
          tempExpanded && {
            zIndex: "drawer",
            "& .MuiDrawer-paper": {
              bgcolor: (theme) =>
                colord(theme.palette.background.paper)
                  .mix("#fff", 0.09)
                  .alpha(1)
                  .toHslString(),
              boxShadow: (theme) =>
                theme.shadows[4].replace(/, 0 (\d+px)/g, ", $1 0"),
            },
          },
        ]}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {!isPermanent && (
          <Stack
            direction="row"
            alignItems="center"
            sx={{ height: TOP_BAR_HEIGHT, flexShrink: 0, px: 0.5 }}
          >
            <IconButton
              aria-label="Close navigation drawer"
              onClick={onClose as any}
              size="large"
            >
              <CloseIcon />
            </IconButton>

            <Logo style={{ marginLeft: 1, position: "relative", zIndex: 1 }} />
          </Stack>
        )}

        <nav style={{ flexGrow: 1 }}>
          <List
            disablePadding
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <li>
              <NavItem onClick={closeDrawer}>
                <ListItemIcon>
                  <ArrowBackIcon />
                </ListItemIcon>
                <ListItemText primary="Workspace" />
              </NavItem>
            </li>

            <li>
              <NavItem onClick={closeDrawer}>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      borderRadius: 1,
                      width: 24,
                      height: 24,
                      fontSize: "inherit",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    P
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Project" />
              </NavItem>
            </li>

            {/* {userRoles.includes("ADMIN") && (
            <li>
              <NavItem to={ROUTES.userManagement} onClick={closeDrawer}>
                <ListItemIcon>
                  <UserManagementIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </NavItem>
            </li>
          )} */}

            <Divider variant="middle" sx={{ my: 1 }} />

            <li>
              <NavItem to={ROUTES.tables} onClick={closeDrawer}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </NavItem>
            </li>

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

            <Divider variant="middle" sx={{ my: 1 }} />

            {/* <ListSubheader>Your tables</ListSubheader> */}

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

            {/* <li>
            <NavItem to={ROUTES.tables} onClick={closeDrawer}>
              <ListItemIcon>
                <TableIcon />
              </ListItemIcon>
              <ListItemText primary="Table" />
            </NavItem>
          </li> */}

            {sections &&
              Object.entries(sections)
                .filter(([, tables]) => tables.length > 0)
                .map(([section, tables]) => (
                  <NavTableSection
                    key={section}
                    section={section}
                    tables={tables}
                    closeDrawer={closeDrawer}
                    hidden={isPermanent && !open && !tempExpanded}
                  />
                ))}

            <Divider variant="middle" sx={{ my: 1, mt: "auto" }} />

            <li>
              <NavItem href={EXTERNAL_LINKS.docs}>
                <ListItemIcon>
                  <DocsIcon />
                </ListItemIcon>
                <ListItemText primary="Docs" />
                {externalLinkIcon}
              </NavItem>
            </li>
            <li>
              <NavItem href={WIKI_LINKS.howTo}>
                <ListItemIcon>
                  <LearningIcon />
                </ListItemIcon>
                <ListItemText primary="Learning" />
                {externalLinkIcon}
              </NavItem>
            </li>
            <li>
              <NavItem href={EXTERNAL_LINKS.docs}>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help" />
              </NavItem>
            </li>
          </List>
        </nav>
      </Drawer>

      {isPermanent && (
        <Box
          sx={{
            flexShrink: 0,
            flexGrow: 0,
            width: open ? NAV_DRAWER_WIDTH : NAV_DRAWER_COLLAPSED_WIDTH,
            transitionProperty: "width",
            transitionTimingFunction: "var(--nav-transition-timing-function)",
            transitionDuration: "var(--nav-transition-duration)",
          }}
        />
      )}
    </>
  );
}
