import { useAtom, useSetAtom } from "jotai";

import {
  Menu,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
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
import ColumnHeader from "@src/components/Table/Column";

import {
  globalScope,
  userSettingsAtom,
  updateUserSettingsAtom,
  confirmDialogAtom,
  columnMenuAtom,
  columnModalAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  updateColumnAtom,
  deleteColumnAtom,
  tableOrdersAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { analytics, logEvent } from "@src/analytics";
import useKeyPress from "@src/hooks/useKeyPress";
import { formatSubTableName } from "@src/utils/table";

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
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, globalScope);
  const [columnMenu, setColumnMenu] = useAtom(columnMenuAtom, globalScope);
  const openColumnModal = useSetAtom(columnModalAtom, globalScope);
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const deleteColumn = useSetAtom(deleteColumnAtom, tableScope);
  const [tableOrders, setTableOrders] = useAtom(tableOrdersAtom, tableScope);
  const altPress = useKeyPress("Alt");

  if (!columnMenu) return null;
  const { column, anchorEl } = columnMenu;
  if (column.type === FieldType.last) return null;

  const handleClose = () => {
    setColumnMenu({ column, anchorEl: null });
    setTimeout(() => setColumnMenu(null), 300);
  };

  const isConfigurable = Boolean(
    getFieldProp("settings", column?.type) ||
      getFieldProp("initializable", column?.type)
  );

  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;
  const isSorted = tableOrders[0]?.key === sortKey;
  const isAsc = isSorted && tableOrders[0]?.direction === "asc";

  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields ?? [];

  const handleDeleteColumn = () => {
    deleteColumn(column.key);
    logEvent(analytics, "delete_column", { type: column.type });
    handleClose();
  };

  const menuItems = [
    { type: "subheader", label: "Your view" },
    {
      label: "Sort: descending",
      activeLabel: "Remove sort: descending",
      icon: <ArrowDownwardIcon />,
      onClick: () => {
        setTableOrders(
          isSorted && !isAsc ? [] : [{ key: sortKey, direction: "desc" }]
        );
        handleClose();
      },
      active: isSorted && !isAsc,
      disabled: column.type === FieldType.id,
    },
    {
      label: "Sort: ascending",
      activeLabel: "Remove sort: ascending",
      icon: <ArrowUpwardIcon />,
      onClick: () => {
        setTableOrders(
          isSorted && isAsc ? [] : [{ key: sortKey, direction: "asc" }]
        );
        handleClose();
      },
      active: isSorted && isAsc,
      disabled: column.type === FieldType.id,
    },
    {
      label: "Hide",
      icon: <VisibilityIcon />,
      onClick: () => {
        if (updateUserSettings)
          updateUserSettings({
            tables: {
              [formatSubTableName(tableId)]: {
                hiddenFields: [...userDocHiddenFields, column.key],
              },
            },
          });
        handleClose();
      },
      disabled: !updateUserSettings,
    },
    {
      label: "Filter…",
      icon: <FilterIcon />,
      // FIXME: onClick: () => {
      //   actions.update(column.key, { hidden: !column.hidden });
      //   handleClose();
      // },
      active: column.hidden,
      disabled: true,
    },
    { type: "subheader", label: "All users’ views" },
    {
      label: "Lock",
      activeLabel: "Unlock",
      icon: <LockOpenIcon />,
      activeIcon: <LockIcon />,
      onClick: () => {
        updateColumn({
          key: column.key,
          config: { editable: !column.editable },
        });
        handleClose();
      },
      active: !column.editable,
    },
    {
      label: "Disable resize",
      activeLabel: "Enable resize",
      icon: <CellResizeIcon />,
      onClick: () => {
        updateColumn({
          key: column.key,
          config: { resizable: !column.resizable },
        });
        handleClose();
      },
      active: !column.resizable,
    },
    {
      label: "Freeze",
      activeLabel: "Unfreeze",
      icon: <FreezeIcon />,
      activeIcon: <UnfreezeIcon />,
      onClick: () => {
        updateColumn({ key: column.key, config: { fixed: !column.fixed } });
        handleClose();
      },
      active: column.fixed,
    },
    { type: "subheader", label: "Add column" },
    {
      label: "Add new to left…",
      icon: <ColumnPlusBeforeIcon />,
      onClick: () => {
        openColumnModal({ type: "new", index: column.index - 1 });
        handleClose();
      },
    },
    {
      label: "Add new to right…",
      icon: <ColumnPlusAfterIcon />,
      onClick: () => {
        openColumnModal({ type: "new", index: column.index + 1 });
        handleClose();
      },
    },
    { type: "subheader", label: "Configure" },
    {
      label: "Rename…",
      icon: <EditIcon />,
      onClick: () => {
        openColumnModal({ type: "name", columnKey: column.key });
        handleClose();
      },
    },
    {
      label: `Edit type: ${getFieldProp("name", column.type)}…`,
      // This is based on the cell type
      icon: getFieldProp("icon", column.type),
      onClick: () => {
        openColumnModal({ type: "type", columnKey: column.key });
        handleClose();
      },
    },
    {
      label: `Column config…`,
      icon: <SettingsIcon />,
      onClick: () => {
        openColumnModal({ type: "config", columnKey: column.key });
        handleClose();
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
      label: `Delete column${altPress ? "" : "…"}`,
      icon: <ColumnRemoveIcon />,
      onClick: altPress
        ? handleDeleteColumn
        : () =>
            confirm({
              title: "Delete column?",
              body: (
                <>
                  <Typography>
                    Only the column configuration will be deleted. No data will
                    be deleted. This cannot be undone.
                  </Typography>
                  <ColumnHeader type={column.type} label={column.name} />
                  <Typography sx={{ mt: 1 }}>
                    Key: <code style={{ userSelect: "all" }}>{column.key}</code>
                  </Typography>
                </>
              ),
              confirm: "Delete",
              confirmColor: "error",
              handleConfirm: handleDeleteColumn,
            }),
      color: "error" as "error",
    },
  ];

  return (
    <Menu
      id="column-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
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
  );
}
