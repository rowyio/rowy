import clsx from "clsx";

import {
  createStyles,
  makeStyles,
  MenuItem,
  ListItemIcon,
  ListSubheader,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    subheader: {
      ...theme.typography.overline,
      color: theme.palette.text.disabled,
      padding: theme.spacing(1, 1.25),
      paddingTop: theme.spacing(2) + 1,

      cursor: "default",
      userSelect: "none",

      "&:focus": { outline: 0 },
    },

    menuItem: {
      minHeight: 42,
      padding: theme.spacing(0.75, 1.25),

      ...theme.typography.h6,
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
      transition: theme.transitions.create(["background-color", "color"], {
        duration: theme.transitions.duration.shortest,
      }),

      "&:hover": {
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.type === "light" ? "#f1f1f3" : "#212129",
      },
    },
    menuItemIcon: {
      minWidth: 24,
      marginRight: theme.spacing(1.25),
      color: "inherit",
    },

    menuItemActive: { color: theme.palette.text.primary },
    menuItemError: {
      color: theme.palette.error.main,
      "&:hover": {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
      },
    },
  })
);

export interface IMenuContentsProps {
  menuItems: {
    type?: string;
    label?: string;
    activeLabel?: string;
    icon?: JSX.Element;
    activeIcon?: JSX.Element;
    onClick?: () => void;
    active?: boolean;
    color?: "error";
    disabled?: boolean;
  }[];
}

export default function MenuContents({ menuItems }: IMenuContentsProps) {
  const classes = useStyles();

  return (
    <>
      {menuItems.map((item, index) => {
        if (item.type === "subheader")
          return (
            <>
              {index !== 0 && <Divider />}
              <ListSubheader
                key={index}
                className={classes.subheader}
                disableGutters
                disableSticky
              >
                {item.label}
              </ListSubheader>
            </>
          );

        let icon: JSX.Element = item.icon ?? <></>;
        if (item.active && !!item.activeIcon) icon = item.activeIcon;

        return (
          <>
            {index !== 0 && <Divider />}
            <MenuItem
              key={index}
              onClick={item.onClick}
              className={clsx(
                classes.menuItem,
                item.active && classes.menuItemActive,
                item.color === "error" && classes.menuItemError
              )}
              disabled={item.disabled}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                {icon}
              </ListItemIcon>
              {item.active ? item.activeLabel : item.label}
            </MenuItem>
          </>
        );
      })}
    </>
  );
}
