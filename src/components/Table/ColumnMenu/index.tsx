import React, { useState, useEffect } from "react";

import {
  Menu,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/LockOutlined";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
// import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import FreezeIcon from "@src/assets/icons/Freeze";
import UnfreezeIcon from "@src/assets/icons/Unfreeze";
import CellResizeIcon from "@src/assets/icons/CellResize";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/EditOutlined";
// import ReorderIcon from "@mui/icons-material/Reorder";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import ColumnPlusBeforeIcon from "@src/assets/icons/ColumnPlusBefore";
import ColumnPlusAfterIcon from "@src/assets/icons/ColumnPlusAfter";
import ColumnRemoveIcon from "@src/assets/icons/ColumnRemove";

import MenuContents from "./MenuContents";
import NameChange from "./NameChange";
import NewColumn from "./NewColumn";
import TypeChange from "./TypeChange";
import FieldSettings from "./FieldSettings";
import ColumnHeader from "@src/components/Wizards/Column";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

import { Column } from "react-data-grid";
import { PopoverProps } from "@mui/material";
import { useConfirmation } from "@src/components/ConfirmationDialog";
import { analytics } from "@src/analytics";

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
  handleSave: (
    fieldName: string,
    config: Record<string, any>,
    onSuccess?: Function
  ) => void;
}

export default function ColumnMenu() {
  const [modal, setModal] = useState(INITIAL_MODAL);
  const { tableState, tableActions, columnMenuRef } = useProjectContext();
  const { requestConfirmation } = useConfirmation();

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
        data: {},
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
  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;
  const isSorted = orderBy?.[0]?.key === sortKey;
  const isAsc = isSorted && orderBy?.[0]?.direction === "asc";

  const clearModal = () => {
    setModal(INITIAL_MODAL);
    setTimeout(() => handleClose(), 300);
  };

  const handleModalSave = (
    key: string,
    update: Record<string, any>,
    onSuccess?: Function
  ) => {
    actions.update(key, update, onSuccess);
  };
  const openSettings = (column) => {
    setSelectedColumnHeader({
      column,
    });
    setModal({ type: ModalStates.settings, data: { column } });
  };
  const menuItems = [
    { type: "subheader" },
    {
      label: "Lock",
      activeLabel: "Unlock",
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
      label: "Sort: descending",
      activeLabel: "Sorted: descending",
      icon: <ArrowDownwardIcon />,
      onClick: () => {
        tableActions.table.orderBy(
          isSorted && !isAsc ? [] : [{ key: sortKey, direction: "desc" }]
        );
        handleClose();
      },
      active: isSorted && !isAsc,
      disabled: column.type === FieldType.id,
    },
    {
      label: "Sort: ascending",
      activeLabel: "Sorted: ascending",
      icon: <ArrowUpwardIcon />,
      onClick: () => {
        tableActions.table.orderBy(
          isSorted && isAsc ? [] : [{ key: sortKey, direction: "asc" }]
        );
        handleClose();
      },
      active: isSorted && isAsc,
      disabled: column.type === FieldType.id,
    },
    { type: "subheader" },
    {
      label: "Add new to left…",
      icon: <ColumnPlusBeforeIcon />,
      onClick: () =>
        setModal({
          type: ModalStates.new,
          data: {
            insert: "left",
            sourceIndex: column.index,
          },
        }),
    },
    {
      label: "Add new to right…",
      icon: <ColumnPlusAfterIcon />,
      onClick: () =>
        setModal({
          type: ModalStates.new,
          data: {
            insert: "right",
            sourceIndex: column.index,
          },
        }),
    },
    { type: "subheader" },
    {
      label: "Rename…",
      icon: <EditIcon />,
      onClick: () => {
        setModal({ type: ModalStates.nameChange, data: {} });
      },
    },
    {
      label: `Edit type: ${getFieldProp("name", column.type)}…`,
      // This is based off the cell type
      icon: getFieldProp("icon", column.type),
      onClick: () => {
        setModal({ type: ModalStates.typeChange, data: { column } });
      },
    },
    {
      label: `Column settings…`,
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

    // {
    //   label: "Hide for everyone",
    //   activeLabel: "Show",
    //   icon: <VisibilityOffIcon />,
    //   activeIcon: <VisibilityIcon />,
    //   onClick: () => {
    //     actions.update(column.key, { hidden: !column.hidden });
    //     handleClose();
    //   },
    //   active: column.hidden,
    //   color: "error" as "error",
    // },
    {
      label: "Delete column…",
      icon: <ColumnRemoveIcon />,
      onClick: () =>
        requestConfirmation({
          title: "Delete column?",
          customBody: (
            <>
              <Typography>
                Only the column configuration will be deleted. No data will be
                deleted.
              </Typography>
              <ColumnHeader type={column.type} label={column.name} />
              <Typography sx={{ mt: 1 }}>
                Key: <code style={{ userSelect: "all" }}>{column.key}</code>
              </Typography>
            </>
          ),
          confirm: "Delete",
          confirmColor: "error",
          handleConfirm: async () => {
            actions.remove(column.key);
            await analytics.logEvent("delete_column", { type: column.type });
            handleClose();
          },
        }),
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
          id="column-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ "& .MuiMenu-paper": { backgroundColor: "background.default" } }}
          MenuListProps={{ disablePadding: true }}
        >
          <ListItem>
            <ListItemIcon style={{ minWidth: 36 }}>
              {getFieldProp("icon", column.type)}
            </ListItemIcon>
            <ListItemText
              primary={column.name as string}
              secondary={
                <>
                  Key: <code style={{ userSelect: "all" }}>{column.key}</code>
                </>
              }
              primaryTypographyProps={{ variant: "subtitle2" }}
              secondaryTypographyProps={{ variant: "caption" }}
              sx={{ m: 0, minHeight: 40, "& > *": { userSelect: "none" } }}
            />
          </ListItem>
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
            key={column.key}
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
