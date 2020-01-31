import React from "react";
import clsx from "clsx";

import {
  createStyles,
  makeStyles,
  Menu,
  MenuProps,
  MenuItem,
  ListItemIcon,
  ListSubheader,
  Divider,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";

import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FreezeIcon from "assets/icons/Freeze";
import UnfreezeIcon from "assets/icons/Unfreeze";
import CellResizeIcon from "assets/icons/CellResize";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import EditIcon from "@material-ui/icons/Edit";
import ReorderIcon from "@material-ui/icons/Reorder";
import ColumnPlusBeforeIcon from "assets/icons/ColumnPlusBefore";
import ColumnPlusAfterIcon from "assets/icons/ColumnPlusAfter";
import ColumnRemoveIcon from "assets/icons/ColumnRemove";

// Note: this only imports the type
import { Column } from "react-data-grid";

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      // TODO: change this if we need to support a dark mode
      backgroundColor: "#f1f1f3",
    },

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
        color: "#f1f1f3",
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
        backgroundColor: fade(
          theme.palette.error.main,
          theme.palette.action.hoverOpacity
        ),
      },
    },
  })
);

export interface IColumnMenuProps {
  anchorEl: MenuProps["anchorEl"];
  handleClose: MenuProps["onClose"];
  column: Column<any> & { [key: string]: any };
}

// TODO: implement active states and actions
const ColumnMenu: React.FC<IColumnMenuProps> = ({
  anchorEl,
  handleClose,
  column,
}) => {
  const classes = useStyles();

  const menuItems = [
    { type: "subheader", label: "View" },
    {
      label: "Lock",
      activeLabel: "Locked",
      icon: <LockOpenIcon />,
      activeIcon: <LockIcon />,
      onClick: () => alert("LOCK"),
      active: column.locked,
    },
    {
      label: "Hide",
      activeLabel: "Show",
      icon: <VisibilityOffIcon />,
      activeIcon: <VisibilityIcon />,
      onClick: () => alert("HIDE/SHOW"),
      active: false,
    },
    {
      label: "Freeze",
      activeLabel: "Unfreeze",
      icon: <FreezeIcon />,
      activeIcon: <UnfreezeIcon />,
      onClick: () => alert("FREEZE"),
      active: false,
    },
    {
      label: "Enable resize",
      activeLabel: "Disable resize",
      icon: <CellResizeIcon />,
      onClick: () => alert("RESIZE"),
      active: column.resizable,
    },
    {
      label: "Sort: Decreasing",
      activeLabel: "Sorted: Decreasing",
      icon: <ArrowDownwardIcon />,
      onClick: () => alert("SORT DECREASING"),
      active: false,
    },
    {
      label: "Sort: Increasing",
      activeLabel: "Sorted: Increasing",
      icon: <ArrowUpwardIcon />,
      onClick: () => alert("SORT INCREASING"),
      active: false,
    },
    { type: "subheader", label: "Edit" },
    {
      label: "Rename",
      icon: <EditIcon />,
      onClick: () => alert("EDIT"),
    },
    {
      label: `Edit Type: ${column?.type}`,
      // TODO: This is based off the cell type
      // icon: <VisibilityOffIcon />,
      onClick: () => alert("EDIT TYPE"),
    },
    {
      label: "Re-order",
      icon: <ReorderIcon />,
      onClick: () => alert("REORDER"),
    },
    {
      label: "Add New to Left",
      icon: <ColumnPlusBeforeIcon />,
      onClick: () => alert("ADD NEW LEFT"),
    },
    {
      label: "Add New to Right",
      icon: <ColumnPlusAfterIcon />,
      onClick: () => alert("ADD NEW RIGHT"),
    },
    {
      label: "Delete Column",
      icon: <ColumnRemoveIcon />,
      onClick: () => alert("DELETE COLUMN"),
      color: "error",
    },
  ];

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      classes={{ paper: classes.paper }}
      MenuListProps={{ disablePadding: true }}
    >
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

        let icon = item.icon ?? <></>;
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
            >
              <ListItemIcon className={classes.menuItemIcon}>
                {icon}
              </ListItemIcon>
              {item.active ? item.activeLabel : item.label}
            </MenuItem>
          </>
        );
      })}
    </Menu>
  );
};

export default ColumnMenu;
