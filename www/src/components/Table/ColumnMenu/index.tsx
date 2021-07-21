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
import FieldSettings from "./FieldSettings";

import { useFiretableContext } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";
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

export interface IMenuModalProps {
  name: string;
  fieldName: string;
  type: FieldType;

  open: boolean;
  config: Record<string, any>;

  handleClose: () => void;
  handleSave: (fieldName: string, config: Record<string, any>) => void;
}

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

  const isConfigurable = Boolean(
    getFieldProp("settings", column?.type) ||
      getFieldProp("initializable", column?.type)
  );

  if (!column) return null;

  const isSorted = orderBy?.[0]?.key === column.key;
  const isAsc = isSorted && orderBy?.[0]?.direction === "asc";

  const clearModal = () => {
    setModal(INITIAL_MODAL);
    setTimeout(() => handleClose(), 300);
  };

  const handleModalSave = (key: string, update: Record<string, any>) => {
    actions.update(key, update);
  };
  const openSettings = (column) => {
    setSelectedColumnHeader({
      column,
    });
    setModal({ type: ModalStates.settings, data: { column } });
  };
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
      label: `Edit Type: ${getFieldProp("name", column.type)}`,
      // This is based off the cell type
      icon: getFieldProp("icon", column.type),
      onClick: () => {
        setModal({ type: ModalStates.typeChange, data: { column } });
      },
    },
    {
      label: `Column Settings`,
      // This is based off the cell type
      icon: <SettingsIcon />,
      onClick: () => {
        openSettings(column);
      },
      disabled: !isConfigurable,
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
      label: "Hide for Everyone",
      activeLabel: "Show",
      icon: <VisibilityOffIcon />,
      activeIcon: <VisibilityIcon />,
      onClick: () => {
        actions.update(column.key, { hidden: !column.hidden });
        handleClose();
      },
      active: column.hidden,
      color: "error" as "error",
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

  const menuModalProps = {
    name: column.name,
    fieldName: column.key,
    type: column.type,

    open: modal.type === ModalStates.typeChange,
    config: column.config,

    handleClose: clearModal,
    handleSave: handleModalSave,
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
            {...menuModalProps}
            open={modal.type === ModalStates.nameChange}
          />
          <TypeChange
            {...menuModalProps}
            open={modal.type === ModalStates.typeChange}
          />
          <FieldSettings
            {...menuModalProps}
            open={modal.type === ModalStates.settings}
          />
          <NewColumn
            {...menuModalProps}
            open={modal.type === ModalStates.new}
            data={modal.data}
            openSettings={openSettings}
          />
        </>
      )}
    </>
  );
}
