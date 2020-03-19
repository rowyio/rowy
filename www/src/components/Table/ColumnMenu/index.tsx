import React from "react";

import { createStyles, makeStyles, Menu } from "@material-ui/core";

import MenuContents from "./MenuContents";

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

import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      // TODO: change this if we need to support a dark mode
      backgroundColor: "#f1f1f3",
    },
  })
);

export default function ColumnMenu() {
  const classes = useStyles();

  const {
    tableState,
    tableActions,
    selectedColumnHeader,
    setSelectedColumnHeader,
  } = useFiretableContext();
  const actions = tableActions!.column;
  const { column, anchorEl } = selectedColumnHeader ?? {};

  const handleClose = () => {
    if (!setSelectedColumnHeader) return;
    setSelectedColumnHeader({ column: column!, anchorEl: null });
    setTimeout(() => setSelectedColumnHeader(null), 300);
  };

  if (!column) return null;

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
      color: "error" as "error",
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
      <MenuContents menuItems={menuItems} />
    </Menu>
  );
}
