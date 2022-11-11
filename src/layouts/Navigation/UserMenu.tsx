import { useState, useRef } from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

import {
  IconButton,
  IconButtonProps,
  Avatar,
  Menu,
  MenuItem,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  Divider,
  Grow,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import { ChevronRight as ChevronRightIcon } from "@src/assets/icons";

import {
  projectScope,
  projectIdAtom,
  userSettingsAtom,
  themeAtom,
  themeOverriddenAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";

export default function UserMenu(props: IconButtonProps) {
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [themeSubMenu, setThemeSubMenu] = useState<HTMLElement | null>(null);

  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [theme, setTheme] = useAtom(themeAtom, projectScope);
  const [themeOverridden, setThemeOverridden] = useAtom(
    themeOverriddenAtom,
    projectScope
  );

  const displayName = userSettings.user?.displayName;
  const avatarUrl = userSettings.user?.photoURL;
  const email = userSettings.user?.email;

  const avatar = avatarUrl ? <Avatar src={avatarUrl} /> : <AccountCircleIcon />;

  const changeTheme = (option: "system" | "light" | "dark") => {
    if (option === "system") {
      setThemeOverridden(false);
    } else {
      setTheme(option);
      setThemeOverridden(true);
    }

    setThemeSubMenu(null);
    setOpen(false);
  };

  return (
    <>
      <Grow in>
        <IconButton
          aria-label="Open user menu"
          aria-controls="user-menu"
          aria-haspopup="true"
          size="large"
          {...props}
          ref={anchorEl}
          onClick={() => setOpen(true)}
          sx={{ "& .MuiAvatar-root": { width: 22, height: 22, m: 1 / 8 } }}
        >
          {avatar}
        </IconButton>
      </Grow>

      <Menu
        anchorEl={anchorEl.current}
        id="user-menu"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        sx={{ "& .MuiPaper-root": { minWidth: 160 } }}
      >
        <ListItem
          sx={{
            cursor: "default",
            flexDirection: "column",
            textAlign: "center",
            pt: 1.5,
          }}
        >
          <ListItemAvatar
            sx={{
              minWidth: 48,
              "& > *": { width: 48, height: 48, fontSize: 48 },
            }}
          >
            {avatar}
          </ListItemAvatar>
          <ListItemText
            primary={displayName}
            secondary={
              <>
                {email}
                <br />
                <Typography variant="caption">Project: {projectId}</Typography>
              </>
            }
            primaryTypographyProps={{ variant: "subtitle1" }}
          />
        </ListItem>

        <Divider variant="middle" sx={{ mt: 0.5, mb: 0.5 }} />

        <MenuItem onClick={(e) => setThemeSubMenu(e.currentTarget)}>
          Theme
          <ListItemSecondaryAction style={{ pointerEvents: "none" }}>
            <ChevronRightIcon style={{ display: "block" }} color="action" />
          </ListItemSecondaryAction>
        </MenuItem>

        <Menu
          anchorEl={themeSubMenu}
          id="theme-sub-menu"
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(themeSubMenu)}
          onClose={() => setThemeSubMenu(null)}
          sx={{ "& .MuiPaper-root": { mt: -0.5 } }}
        >
          <MenuItem
            onClick={() => changeTheme("system")}
            selected={!themeOverridden}
          >
            System
          </MenuItem>
          <MenuItem
            onClick={() => changeTheme("light")}
            selected={themeOverridden && theme === "light"}
          >
            Light
          </MenuItem>
          <MenuItem
            onClick={() => changeTheme("dark")}
            selected={themeOverridden && theme === "dark"}
          >
            Dark
          </MenuItem>
        </Menu>

        <MenuItem
          component={Link}
          to={ROUTES.userSettings}
          onClick={() => setOpen(false)}
        >
          Settings
        </MenuItem>

        <Divider variant="middle" />

        <MenuItem
          component={Link}
          to={ROUTES.signOut}
          onClick={() => setOpen(false)}
        >
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
