import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import {
  makeStyles,
  createStyles,
  IconButton,
  IconButtonProps,
  Avatar,
  Menu,
  Link as MuiLink,
  MenuItem,
  ListItemSecondaryAction,
  // Divider,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import { useAppContext } from "contexts/appContext";
import routes from "constants/routes";

const useStyles = makeStyles((theme) =>
  createStyles({
    avatar: {
      width: 24,
      height: 24,
    },

    paper: { minWidth: 160 },
    displayName: {
      display: "block",
      padding: theme.spacing(1, 2),
      userSelect: "none",
      color: theme.palette.text.disabled,
    },

    // divider: { margin: theme.spacing(1, 2) },

    secondaryAction: { pointerEvents: "none" },
    secondaryIcon: {
      display: "block",
      color: theme.palette.action.active,
    },
  })
);

export default function UserMenu(props: IconButtonProps) {
  const classes = useStyles();

  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const {
    currentUser,
    userDoc,
    theme,
    setTheme,
    setThemeOverridden,
  } = useAppContext();
  if (!currentUser || !userDoc || !userDoc?.state?.doc) return null;

  const displayName = userDoc?.state?.doc?.user?.displayName;
  const avatarUrl = userDoc?.state?.doc?.user?.photoURL;

  const handleToggleTheme = () => {
    if (theme === "light") setTheme(() => "dark");
    if (theme === "dark") setTheme(() => "light");
    setThemeOverridden(true);
  };

  return (
    <>
      <IconButton
        aria-label="Open user menu"
        aria-controls="user-menu"
        aria-haspopup="true"
        edge="end"
        {...props}
        ref={anchorEl}
        onClick={() => setOpen(true)}
      >
        {avatarUrl ? (
          <Avatar src={avatarUrl} className={classes.avatar} />
        ) : (
          <AccountCircleIcon />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl.current}
        id="user-menu"
        keepMounted
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        getContentAnchorEl={null}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        classes={{ paper: classes.paper }}
      >
        {displayName && (
          <MuiLink
            variant="overline"
            className={classes.displayName}
            component="a"
            href={`https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/firestore/data~2F_FT_USERS~2F${currentUser.uid}`}
            target="_blank"
            rel="noopener"
          >
            {displayName}
          </MuiLink>
        )}

        <MenuItem onClick={handleToggleTheme}>
          Dark Theme
          <ListItemSecondaryAction className={classes.secondaryAction}>
            {theme === "light" ? (
              <CheckBoxOutlineBlankIcon className={classes.secondaryIcon} />
            ) : (
              <CheckBoxIcon className={classes.secondaryIcon} />
            )}
          </ListItemSecondaryAction>
        </MenuItem>

        <MenuItem component={Link} to={routes.signOut}>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}
