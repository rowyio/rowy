import { useAtom, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";

import {
  Menu,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Freeze as FreezeIcon,
  Unfreeze as UnfreezeIcon,
  CellResize as CellResizeIcon,
  ColumnPlusBefore as ColumnPlusBeforeIcon,
  ColumnPlusAfter as ColumnPlusAfterIcon,
  ColumnRemove as ColumnRemoveIcon,
} from "@src/assets/icons";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/EditOutlined";
// import ReorderIcon from "@mui/icons-material/Reorder";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import EvalIcon from "@mui/icons-material/PlayCircleOutline";

import MenuContents, { IMenuContentsProps } from "./MenuContents";
import ColumnHeader from "@src/components/Table/Column";

import {
  projectScope,
  userRolesAtom,
  userSettingsAtom,
  updateUserSettingsAtom,
  confirmDialogAtom,
  rowyRunAtom,
  altPressAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  updateColumnAtom,
  deleteColumnAtom,
  tableSortsAtom,
  columnMenuAtom,
  columnModalAtom,
  tableFiltersPopoverAtom,
  tableNextPageAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { analytics, logEvent } from "@src/analytics";
import {
  formatSubTableName,
  getTableBuildFunctionPathname,
  getTableSchemaPath,
} from "@src/utils/table";
import { runRoutes } from "@src/constants/runRoutes";
import { useSnackLogContext } from "@src/contexts/SnackLogContext";

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
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, projectScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const deleteColumn = useSetAtom(deleteColumnAtom, tableScope);
  const [tableSorts, setTableSorts] = useAtom(tableSortsAtom, tableScope);
  const [columnMenu, setColumnMenu] = useAtom(columnMenuAtom, tableScope);
  const openColumnModal = useSetAtom(columnModalAtom, tableScope);
  const openTableFiltersPopover = useSetAtom(
    tableFiltersPopoverAtom,
    tableScope
  );
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const snackLogContext = useSnackLogContext();

  const [altPress] = useAtom(altPressAtom, projectScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
  const isSorted = tableSorts[0]?.key === sortKey;
  const isAsc = isSorted && tableSorts[0]?.direction === "asc";

  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields ?? [];

  let referencedColumns: string[] = [];
  let referencedExtensions: string[] = [];
  Object.entries(tableSchema?.columns ?? {}).forEach(([key, c], index) => {
    if (
      c.config?.listenerFields?.includes(column.key) ||
      c.config?.requiredFields?.includes(column.key)
    ) {
      referencedColumns.push(key);
    }
  });
  tableSchema?.extensionObjects?.forEach((extension) => {
    if (extension.requiredFields.includes(column.key)) {
      referencedExtensions.push(extension.name);
    }
  });
  const requireRebuild =
    referencedColumns.length || referencedExtensions.length;

  const handleDeleteColumn = () => {
    deleteColumn(column.key);
    if (requireRebuild) {
      snackLogContext.requestSnackLog();
      rowyRun({
        route: runRoutes.buildFunction,
        body: {
          tablePath: tableSettings.collection,
          // pathname must match old URL format
          pathname: getTableBuildFunctionPathname(
            tableSettings.id,
            tableSettings.tableType
          ),
          tableConfigPath: getTableSchemaPath(tableSettings),
        },
      });
      logEvent(analytics, "deployed_extensions");
    }
    logEvent(analytics, "delete_column", { type: column.type });
    handleClose();
  };

  const localViewActions: IMenuContentsProps["menuItems"] = [
    { type: "subheader", key: "subLocalView" },
    {
      key: "sortDesc",
      label: "Sort: descending",
      activeLabel: "Remove sort: descending",
      icon: <ArrowDownwardIcon />,
      onClick: () => {
        setTableSorts(
          isSorted && !isAsc ? [] : [{ key: sortKey, direction: "desc" }]
        );
        handleClose();
      },
      active: isSorted && !isAsc,
      disabled: column.type === FieldType.id,
    },
    {
      key: "sortAsc",
      label: "Sort: ascending",
      activeLabel: "Remove sort: ascending",
      icon: <ArrowUpwardIcon />,
      onClick: () => {
        setTableSorts(
          isSorted && isAsc ? [] : [{ key: sortKey, direction: "asc" }]
        );
        handleClose();
      },
      active: isSorted && isAsc,
      disabled: column.type === FieldType.id,
    },
    {
      key: "hide",
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
      key: "filter",
      label: "Filter…",
      icon: <FilterIcon />,
      onClick: () => {
        openTableFiltersPopover({
          defaultQuery: {
            key: column.fieldName,
            operator:
              getFieldProp("filter", column.type)!.operators[0]?.value || "==",
            value: "",
          },
        });
        handleClose();
      },
      active: column.hidden,
      disabled: !getFieldProp("filter", column.type),
    },
  ];

  const configActions: IMenuContentsProps["menuItems"] = [
    { type: "subheader", key: "subActionsConfig" },
    {
      label: "Lock",
      key: "lock",
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
      key: "disableResize",
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
      key: "freeze",
      activeLabel: "Unfreeze",
      icon: <FreezeIcon />,
      activeIcon: <UnfreezeIcon />,
      onClick: () => {
        updateColumn({ key: column.key, config: { fixed: !column.fixed } });
        handleClose();
      },
      active: column.fixed,
    },
    // { type: "subheader" },
    {
      label: "Rename…",
      key: "rename",
      icon: <EditIcon />,
      onClick: () => {
        openColumnModal({ type: "name", columnKey: column.key });
        handleClose();
      },
    },
    {
      label: `Edit type: ${getFieldProp("name", column.type)}…`,
      key: "editType",
      // This is based on the cell type
      icon: getFieldProp("icon", column.type),
      onClick: () => {
        openColumnModal({ type: "type", columnKey: column.key });
        handleClose();
      },
    },
    {
      label: `Column config…`,
      key: "columConfig",
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
  ];

  // TODO: Generalize
  const handleEvaluateAll = async () => {
    try {
      handleClose();
      const evaluatingSnackKey = enqueueSnackbar(`Evaluating “${column.key}”…`);
      const result = await rowyRun({
        route: runRoutes.evaluateDerivative,
        body: {
          collectionPath: tableSettings.collection,
          schemaDocPath: getTableSchemaPath(tableSettings),
          columnKey: column.key,
        },
      });
      closeSnackbar(evaluatingSnackKey);
      if (result.success === false) {
        enqueueSnackbar(result.message, { variant: "error" });
      } else {
        enqueueSnackbar(`Column “${column.key}” evaluated`, {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar(`Failed: ${error}`, { variant: "error" });
    }
  };
  const derivativeActions: IMenuContentsProps["menuItems"] = [
    { type: "subheader", key: "sub-derivative" },
    {
      key: "evaluateAll",
      label: altPress ? "Evaluate all" : "Evaluate all…",
      icon: <EvalIcon />,
      onClick: altPress
        ? handleEvaluateAll
        : () =>
            confirm({
              title: "Evaluate all?",
              body: (
                <>
                  All documents in {tableSettings.collection} collection will be
                  evaluated.
                  <br />{" "}
                  {tableNextPage.available &&
                    "For large collections this will take a while and might incur significant firestore costs."}
                </>
              ),
              handleConfirm: handleEvaluateAll,
              confirm: "Evaluate",
            }),
    },
  ];

  const columnActions: IMenuContentsProps["menuItems"] = [
    { type: "subheader", key: "subActions" },
    {
      label: "Insert to the left…",
      key: "insertLeft",
      icon: <ColumnPlusBeforeIcon />,
      onClick: () => {
        openColumnModal({ type: "new", index: column.index - 1 });
        handleClose();
      },
    },
    {
      label: "Insert to the right…",
      key: "insertRight",
      icon: <ColumnPlusAfterIcon />,
      onClick: () => {
        openColumnModal({ type: "new", index: column.index + 1 });
        handleClose();
      },
    },
    {
      label: `Delete column${altPress ? "" : "…"}`,
      key: "delete",
      icon: <ColumnRemoveIcon />,
      onClick: altPress
        ? handleDeleteColumn
        : () => {
            return confirm({
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
                  {requireRebuild ? (
                    <>
                      <Divider sx={{ my: 2 }} />
                      {referencedColumns.length ? (
                        <Typography sx={{ mt: 1 }}>
                          This column will be removed as a dependency of the following columns:{" "}
                          <Typography key={column} fontWeight="bold" component="span">
                            {referencedColumns.join(", ")}
                          </Typography>
                        </Typography>
                      ) : null}
                      {referencedExtensions.length ? (
                        <Typography sx={{ mt: 1 }}>
                          This column will be removed as a dependency from the following Extensions:{" "}
                          <Typography key={extension} fontWeight="bold" component="span">
                            {referencedExtensions.join(", ")}
                          </Typography>
                      ) : null}
                      <Typography sx={{ mt: 1, fontWeight: "bold" }}>
                        You need to re-deploy this table’s cloud function.
                      </Typography>
                    </>
                  ) : null}
                </>
              ),
              confirm: requireRebuild ? "Delete & re-deploy" : "Delete",
              confirmColor: "error",
              handleConfirm: handleDeleteColumn,
            });
          },
      color: "error" as "error",
    },
  ];

  let menuItems = [...localViewActions];

  if (userRoles.includes("ADMIN") || userRoles.includes("OPS")) {
    menuItems.push.apply(menuItems, configActions);
    if (column.type === FieldType.derivative) {
      menuItems.push.apply(menuItems, derivativeActions);
    }
    menuItems.push.apply(menuItems, columnActions);
  }

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
