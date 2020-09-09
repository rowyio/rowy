import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import {
  makeStyles,
  createStyles,
  IconButton,
  IconButtonProps,
  Avatar,
  Menu,
  Typography,
  MenuItem,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

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
  })
);

export default function UserMenu(props: IconButtonProps) {
  const classes = useStyles();

  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const { currentUser, userDoc } = useAppContext();
  if (!currentUser || !userDoc || !userDoc?.state?.doc) return null;

  const displayName = userDoc?.state?.doc?.user?.displayName;
  const avatarUrl = userDoc?.state?.doc?.user?.photoURL;

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
          <AccountCircle />
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
          <Typography
            variant="overline"
            className={classes.displayName}
            role="presentation"
          >
            {displayName}
          </Typography>
        )}
        <MenuItem component={Link} to={routes.signOut}>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}
