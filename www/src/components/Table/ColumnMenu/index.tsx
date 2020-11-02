import React, { useState, useEffect } from "react";

import { createStyles, makeStyles, Menu } from "@material-ui/core";
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
// import ReorderIcon from "@material-ui/icons/Reorder";
import SettingsIcon from "@material-ui/icons/Settings";
import ColumnPlusBeforeIcon from "assets/icons/ColumnPlusBefore";
import ColumnPlusAfterIcon from "assets/icons/ColumnPlusAfter";
import ColumnRemoveIcon from "assets/icons/ColumnRemove";

import MenuContents from "./MenuContents";
import NameChange from "./NameChange";
import NewColumn from "./NewColumn";
import TypeChange from "./TypeChange";
import Settings from "./Settings";

import { useFiretableContext } from "contexts/firetableContext";
import { FIELDS, FieldType } from "constants/fields";
import _find from "lodash/find";
import { Column } from "react-data-grid";
import { PopoverProps } from "@material-ui/core";

const INITIAL_MODAL = { type: "", data: {} };

enum ModalStates {
  nameChange = "NAME_CHANGE",
  typeChange = "TYPE_CHANGE",
  new = "NEW_COLUMN",
  settings = "COLUMN_SETTINGS",
}

type SelectedColumnHeader = {
  column: Column<any> & { [key: string]: any };
  anchorEl: PopoverProps["anchorEl"];
};
export type ColumnMenuRef = {
  selectedColumnHeader: SelectedColumnHeader | null;
  setSelectedColumnHeader: React.Dispatch<
    React.SetStateAction<SelectedColumnHeader | null>
  >;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor:
        theme.palette.type === "light"
          ? "#f1f1f3"
          : theme.palette.background.elevation?.[8] ??
            theme.palette.background.paper,
    },
  })
);

export default function ColumnMenu() {
  const classes = useStyles();
  const [modal, setModal] = useState(INITIAL_MODAL);
  const { tableState, tableActions, columnMenuRef } = useFiretableContext();

  const [selectedColumnHeader, setSelectedColumnHeader] = useState<any>(null);
  if (columnMenuRef)
    columnMenuRef.current = {
      selectedColumnHeader,
      setSelectedColumnHeader,
    } as any;

  const { column, anchorEl } = (selectedColumnHeader ?? {}) as any;

  useEffect(() => {
    if (column && column.type === FieldType.last) {
      setModal({
        type: ModalStates.new,
        data: {
          initializeColumn: { index: column.index ? column.index + 1 : 0 },
        },
      });
    }
  }, [column]);
  if (!tableState || !tableActions) return null;
  const { orderBy } = tableState;

  const actions = tableActions!.column;

  const handleClose = () => {
    if (!setSelectedColumnHeader) return;
    setSelectedColumnHeader({
      column: column!,
      anchorEl: null,
    });
    setTimeout(() => setSelectedColumnHeader(null), 300);
  };

  if (!column) return null;
  const isSorted = orderBy?.[0]?.key === (column.key as string);
  const isAsc = isSorted && orderBy?.[0]?.direction === "asc";
  const menuItems = [
    {
      type: "subheader",
      label: column.name,
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
        tableActions.table.orderBy(
          isSorted && !isAsc ? [] : [{ key: column.key, direction: "desc" }]
        );
        handleClose();
      },
      active: isSorted && !isAsc,
      disabled: column.type === FieldType.id,
    },
    {
      label: "Sort: Increasing",
      activeLabel: "Sorted: Increasing",
      icon: <ArrowUpwardIcon />,
      onClick: () => {
        tableActions.table.orderBy(
          isSorted && isAsc ? [] : [{ key: column.key, direction: "asc" }]
        );
        handleClose();
      },
      active: isSorted && isAsc,
      disabled: column.type === FieldType.id,
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
      // This is based off the cell type
      icon: _find(FIELDS, { type: column.type })?.icon,
      onClick: () => {
        setModal({ type: ModalStates.typeChange, data: { column } });
      },
    },
    {
      label: `Column Settings`,
      // This is based off the cell type
      icon: <SettingsIcon />,
      onClick: () => {
        setModal({ type: ModalStates.settings, data: { column } });
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
          data: {
            initializeColumn: { index: column.index ? column.index - 1 : 0 },
          },
        }),
    },
    {
      label: "Add New to Right",
      icon: <ColumnPlusAfterIcon />,
      onClick: () =>
        setModal({
          type: ModalStates.new,
          data: {
            initializeColumn: { index: column.index ? column.index + 1 : 0 },
          },
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
    setSelectedColumnHeader(null);
  };

  return (
    <>
      {column.type !== FieldType.last && (
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
      )}
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
          <Settings
            config={column.config}
            name={column.name}
            fieldName={column.key as string}
            open={modal.type === ModalStates.settings}
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
