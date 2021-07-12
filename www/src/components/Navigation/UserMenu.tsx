import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import {
  makeStyles,
  createStyles,
  IconButton,
  IconButtonProps,
  Avatar,
  Menu,
  MenuItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Divider,
  Badge,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import CheckIcon from "@material-ui/icons/Check";

import UpdateChecker, { useLatestUpdateState } from "./UpdateChecker";
import { useAppContext } from "contexts/AppContext";
import routes from "constants/routes";
import { projectId } from "../../firebase";
import meta from "../../../package.json";

const useStyles = makeStyles((theme) =>
  createStyles({
    spacer: {
      width: 48,
      height: 48,
    },

    iconButton: {},
    avatar: {
      "$iconButton &": {
        width: 24,
        height: 24,
      },
    },

    paper: { minWidth: 160 },

    divider: { margin: theme.spacing(1, 2) },

    secondaryAction: { pointerEvents: "none" },
    secondaryIcon: {
      display: "block",
      color: theme.palette.action.active,
    },

    subMenu: {
      backgroundColor:
        theme.palette.background.elevation?.[24] ??
        theme.palette.background.paper,
      marginTop: theme.spacing(-1),
    },
  })
);

export default function UserMenu(props: IconButtonProps) {
  const classes = useStyles();

  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [themeSubMenu, setThemeSubMenu] = useState<EventTarget | null>(null);
  const [latestUpdate] = useLatestUpdateState<null | Record<string, any>>();

  const {
    currentUser,
    userDoc,
    theme,
    themeOverridden,
    setTheme,
    setThemeOverridden,
  } = useAppContext();
  if (!currentUser || !userDoc || !userDoc?.state?.doc)
    return <div className={classes.spacer} />;

  const displayName = userDoc?.state?.doc?.user?.displayName;
  const avatarUrl = userDoc?.state?.doc?.user?.photoURL;
  const email = userDoc?.state?.doc?.user?.email;

  const avatar = avatarUrl ? (
    <Avatar src={avatarUrl} className={classes.avatar} />
  ) : (
    <AccountCircleIcon color="secondary" />
  );

  const changeTheme = (option: "system" | "light" | "dark") => {
    switch (option) {
      case "system":
        setThemeOverridden(false);
        return;

      case "light":
        setTheme("light");
        break;

      case "dark":
        setTheme("dark");
        break;

      default:
        break;
    }
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
        className={classes.iconButton}
      >
        {latestUpdate?.tag_name > "v" + meta.version ? (
          <Badge color="primary" overlap="circular" variant="dot">
            {avatar}
          </Badge>
        ) : (
          avatar
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
        <MenuItem
          component="a"
          href={`https://console.firebase.google.com/project/${projectId}/firestore/data/~2F_FT_USERS~2F${currentUser.uid}`}
          target="_blank"
          rel="noopener"
        >
          <ListItemAvatar>{avatar}</ListItemAvatar>
          <ListItemText primary={displayName} secondary={email} />
        </MenuItem>

        <Divider className={classes.divider} />

        <MenuItem onClick={(e) => setThemeSubMenu(e.target)}>
          Theme
          <ListItemSecondaryAction className={classes.secondaryAction}>
            <ArrowRightIcon className={classes.secondaryIcon} />
          </ListItemSecondaryAction>
        </MenuItem>

        {themeSubMenu && (
          <Menu
            anchorEl={themeSubMenu as any}
            id="theme-sub-menu"
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            getContentAnchorEl={null}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open
            onClose={() => setThemeSubMenu(null)}
            classes={{ paper: classes.subMenu }}
          >
            <MenuItem onClick={() => changeTheme("system")}>
              <ListItemIcon>{!themeOverridden && <CheckIcon />}</ListItemIcon>
              System
            </MenuItem>
            <MenuItem onClick={() => changeTheme("light")}>
              <ListItemIcon>
                {themeOverridden && theme === "light" && <CheckIcon />}
              </ListItemIcon>
              Light
            </MenuItem>
            <MenuItem onClick={() => changeTheme("dark")}>
              <ListItemIcon>
                {themeOverridden && theme === "dark" && <CheckIcon />}
              </ListItemIcon>
              Dark
            </MenuItem>
          </Menu>
        )}

        <MenuItem component={Link} to={routes.signOut}>
          Sign out
        </MenuItem>

        <Divider className={classes.divider} />

        <UpdateChecker />
      </Menu>
    </>
  );
}
