import { useState } from "react";
import { useAtom } from "jotai";
import { useLocation } from "react-router-dom";

import {
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  List,
} from "@mui/material";
import MembersIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import { ChevronDown } from "@src/assets/icons";

import NavItem from "./NavItem";
import UpdateCheckBadge from "@src/layouts/Navigation/UpdateCheckBadge";

import { projectScope, userRolesAtom } from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";

export interface ISettingsNavProps {
  closeDrawer: () => void;
  collapsed: boolean;
}

export default function SettingsNav({
  closeDrawer,
  collapsed,
}: ISettingsNavProps) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(pathname.includes(ROUTES.settings));

  if (!userRoles.includes("ADMIN"))
    return (
      <li>
        <NavItem to={ROUTES.userSettings} onClick={closeDrawer}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </NavItem>
      </li>
    );

  return (
    <>
      <li>
        <NavItem to={ROUTES.members} onClick={closeDrawer}>
          <ListItemIcon>
            <MembersIcon />
          </ListItemIcon>
          <ListItemText primary="Members" />
        </NavItem>
      </li>

      <li>
        <NavItem onClick={() => setOpen((o) => !o)}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />

          <ListItemSecondaryAction>
            <ChevronDown
              sx={{
                color: "action.active",
                m: 0.25,
                display: "block",
                transform: open ? "rotate(180deg)" : "rotate(0)",
                transition: (theme) => theme.transitions.create("transform"),
              }}
            />
          </ListItemSecondaryAction>
          {userRoles.includes("ADMIN") && <UpdateCheckBadge sx={{ mr: 1.5 }} />}
        </NavItem>

        <Collapse in={open && !collapsed}>
          <List style={{ paddingTop: 0 }}>
            <li>
              <NavItem to={ROUTES.userSettings} onClick={closeDrawer}>
                <ListItemIcon />
                <ListItemText
                  primary="User"
                  sx={{
                    "&& .MuiListItemText-primary": {
                      fontWeight: "normal",
                      fontSize: ".8125rem",
                    },
                  }}
                />
              </NavItem>
            </li>

            <li>
              <NavItem to={ROUTES.projectSettings} onClick={closeDrawer}>
                <ListItemIcon />
                <ListItemText
                  primary="Project"
                  sx={{
                    "&& .MuiListItemText-primary": {
                      fontWeight: "normal",
                      fontSize: ".8125rem",
                    },
                  }}
                />
              </NavItem>
            </li>
          </List>
        </Collapse>
      </li>
    </>
  );
}
