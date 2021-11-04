import { useState, useRef } from "react";
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
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { useAppContext } from "@src/contexts/AppContext";
import routes from "@src/constants/routes";

export default function UserMenu(props: IconButtonProps) {
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [themeSubMenu, setThemeSubMenu] = useState<EventTarget | null>(null);

  const {
    userDoc,
    theme,
    themeOverridden,
    setTheme,
    setThemeOverridden,
    projectId,
  } = useAppContext();

  const displayName = userDoc?.state?.doc?.user?.displayName;
  const avatarUrl = userDoc?.state?.doc?.user?.photoURL;
  const email = userDoc?.state?.doc?.user?.email;

  const avatar = avatarUrl ? (
    <Avatar src={avatarUrl} />
  ) : (
    <AccountCircleIcon color="secondary" />
  );

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
          edge="end"
          size="large"
          {...props}
          ref={anchorEl}
          onClick={() => setOpen(true)}
          sx={{ "& .MuiAvatar-root": { width: 24, height: 24 } }}
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

        <MenuItem onClick={(e) => setThemeSubMenu(e.target)}>
          Theme
          <ListItemSecondaryAction style={{ pointerEvents: "none" }}>
            <ArrowRightIcon style={{ display: "block" }} />
          </ListItemSecondaryAction>
        </MenuItem>

        {themeSubMenu && (
          <Menu
            anchorEl={themeSubMenu as any}
            id="theme-sub-menu"
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open
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
        )}

        <MenuItem
          component={Link}
          to={routes.userSettings}
          onClick={() => setOpen(false)}
        >
          Settings
        </MenuItem>

        <Divider variant="middle" />

        <MenuItem
          component={Link}
          to={routes.signOut}
          onClick={() => setOpen(false)}
        >
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
