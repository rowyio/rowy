import React, { useState } from "react";

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
import NameChange from "./NameChange";
import NewColumn from "./NewColumn";
import TypeChange from "./TypeChange";
import { useFiretableContext } from "contexts/firetableContext";
import { FIELDS } from "constants/fields";
import _find from "lodash/find";

const INITIAL_MODAL = { type: "", data: {} };

enum ModalStates {
  nameChange = "NAME_CHANGE",
  typeChange = "TYPE_CHANGE",
  new = "NEW_COLUMN",
}
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
  const [modal, setModal] = useState(INITIAL_MODAL);
  const {
    tableState,
    tableActions,
    selectedColumnHeader,
    setSelectedColumnHeader,
  } = useFiretableContext();
  if (!tableState || !tableActions) return null;
  const { orderBy } = tableState;

  const actions = tableActions!.column;
  const { column, anchorEl } = selectedColumnHeader ?? {};

  const handleClose = () => {
    if (!setSelectedColumnHeader) return;
    setSelectedColumnHeader({ column: column!, anchorEl: null });
    setTimeout(() => setSelectedColumnHeader(null), 300);
  };

  if (!column) return null;
  const isSorted = orderBy?.[0]?.key === (column.key as string);
  const isAsc = isSorted && orderBy?.[0]?.direction === "asc";
  const menuItems = [
    {
      type: "subheader",
      label:
        column.name === column?.key
          ? column.name
          : (`${column.name}(${column?.key as string})` as string),
    },
    {
      label: "Lock",
      activeLabel: "Locked (unlock)",
      icon: <LockOpenIcon />,
      activeIcon: <LockIcon />,
      onClick: () => {
        actions.update(column.key, { editable: !column.editable });
        handleClose();
      },
      active: !column.editable,
    },
    {
      label: "Hide",
      activeLabel: "Show",
      icon: <VisibilityOffIcon />,
      activeIcon: <VisibilityIcon />,
      onClick: () => {
        actions.update(column.key, { hidden: !column.hidden });
        handleClose();
      },
      active: column.hidden,
    },
    {
      label: "Freeze",
      activeLabel: "Unfreeze",
      icon: <FreezeIcon />,
      activeIcon: <UnfreezeIcon />,
      onClick: () => {
        actions.update(column.key, { fixed: !column.fixed });
        handleClose();
      },
      active: column.fixed,
    },
    {
      label: "Enable resize",
      activeLabel: "Disable resize",
      icon: <CellResizeIcon />,
      onClick: () => {
        actions.update(column.key, { resizable: !column.resizable });
        handleClose();
      },
      active: column.resizable,
    },
    {
      label: "Sort: Decreasing",
      activeLabel: "Sorted: Decreasing",
      icon: <ArrowDownwardIcon />,
      onClick: () => {
        tableActions.table.orderBy([{ key: column.key, direction: "desc" }]);
        handleClose();
      },
      active: isSorted && !isAsc,
    },
    {
      label: "Sort: Increasing",
      activeLabel: "Sorted: Increasing",
      icon: <ArrowUpwardIcon />,
      onClick: () => {
        tableActions.table.orderBy([{ key: column.key, direction: "asc" }]);
        handleClose();
      },
      active: isSorted && isAsc,
    },
    { type: "subheader", label: "Edit" },
    {
      label: "Rename",
      icon: <EditIcon />,
      onClick: () => {
        setModal({ type: ModalStates.nameChange, data: {} });
      },
    },
    {
      label: `Edit Type: ${column?.type}`,
      // TODO: This is based off the cell type
      icon: _find(FIELDS, { type: column.type })?.icon,
      onClick: () => {
        setModal({ type: ModalStates.typeChange, data: {} });
      },
    },
    // {
    //   label: "Re-order",
    //   icon: <ReorderIcon />,
    //   onClick: () => alert("REORDER"),
    // },
    {
      label: "Add New to Left",
      icon: <ColumnPlusBeforeIcon />,
      onClick: () =>
        setModal({
          type: ModalStates.new,
          data: { initializeColumn: { index: column.index - 1 } },
        }),
    },
    {
      label: "Add New to Right",
      icon: <ColumnPlusAfterIcon />,
      onClick: () =>
        setModal({
          type: ModalStates.new,
          data: { initializeColumn: { index: column.index + 1 } },
        }),
    },
    {
      label: "Delete Column",
      icon: <ColumnRemoveIcon />,
      onClick: () => {
        actions.remove(column.key);
        handleClose();
      },
      color: "error" as "error",
    },
  ];

  const clearModal = () => {
    setModal(INITIAL_MODAL);
  };
  return (
    <>
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
      {column && (
        <>
          <NameChange
            name={column.name}
            fieldName={column.key as string}
            open={modal.type === ModalStates.nameChange}
            handleClose={clearModal}
            handleSave={(key, update) => {
              actions.update(key, update);
              clearModal();
              handleClose();
            }}
          />

          <TypeChange
            name={column.name}
            fieldName={column.key as string}
            open={modal.type === ModalStates.typeChange}
            type={column.type}
            handleClose={clearModal}
            handleSave={(key, update) => {
              actions.update(key, update);
              clearModal();
              handleClose();
            }}
          />
          <NewColumn
            open={modal.type === ModalStates.new}
            data={modal.data}
            handleClose={clearModal}
            handleSave={(key, update) => {
              actions.update(key, update);
              clearModal();
              handleClose();
            }}
          />
        </>
      )}
    </>
  );
}
