import { Fragment } from "react";
import { useAtom, useSetAtom } from "jotai";
import { getFieldProp } from "@src/components/fields";
import { find } from "lodash-es";

import { Divider } from "@mui/material";
import {
  Copy as CopyIcon,
  CopyCells as DuplicateIcon,
  Clear as ClearIcon,
  Row as RowIcon,
} from "@src/assets/icons";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import FilterIcon from "@mui/icons-material/FilterList";

import ContextMenuItem, { IContextMenuItem } from "./ContextMenuItem";

import {
  projectScope,
  projectIdAtom,
  userRolesAtom,
  altPressAtom,
  confirmDialogAtom,
  updateUserSettingsAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  tableRowsAtom,
  selectedCellAtom,
  addRowAtom,
  deleteRowAtom,
  updateFieldAtom,
  tableFiltersPopoverAtom,
  _updateRowDbAtom,
  tableIdAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { TableRow } from "@src/types/table";
import { generateId } from "@src/utils/table";

interface IMenuContentsProps {
  onClose: () => void;
}

export default function MenuContents({ onClose }: IMenuContentsProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [altPress] = useAtom(altPressAtom, projectScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  const deleteRow = useSetAtom(deleteRowAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const [updateRowDb] = useAtom(_updateRowDbAtom, tableScope);
  const openTableFiltersPopover = useSetAtom(
    tableFiltersPopoverAtom,
    tableScope
  );
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);

  const addRowIdType = tableSchema.idType || "decrement";

  if (!tableSchema.columns || !selectedCell) return null;

  const selectedColumn = tableSchema.columns[selectedCell.columnKey];
  const row = find(
    tableRows,
    selectedCell?.arrayIndex === undefined
      ? ["_rowy_ref.path", selectedCell.path]
      : // if the table is an array table, we need to use the array index to find the row
        ["_rowy_ref.arrayTableData.index", selectedCell.arrayIndex]
  );

  if (!row) return null;

  const actionGroups: IContextMenuItem[][] = [];

  const handleDuplicate = () => {
    const _duplicate = () => {
      if (row._rowy_ref.arrayTableData !== undefined) {
        if (!updateRowDb) return;

        return updateRowDb("", {}, undefined, {
          index: row._rowy_ref.arrayTableData.index,
          operation: {
            addRow: "bottom",
            base: row,
          },
        });
      }
      return addRow({
        row: row,
        setId: addRowIdType === "custom" ? "decrement" : addRowIdType,
      });
    };

    if (altPress || row._rowy_ref.arrayTableData !== undefined) {
      _duplicate();
    } else {
      confirm({
        title: "Duplicate row?",
        body: (
          <>
            Row path:
            <br />
            <code style={{ userSelect: "all", wordBreak: "break-all" }}>
              {row._rowy_ref.path}
            </code>
          </>
        ),
        confirm: "Duplicate",
        handleConfirm: _duplicate,
      });
    }
  };
  const handleDelete = () => {
    const _delete = () =>
      deleteRow({
        path: row._rowy_ref.path,
        options: row._rowy_ref.arrayTableData,
      });

    if (altPress || row._rowy_ref.arrayTableData !== undefined) {
      _delete();
    } else {
      confirm({
        title: "Delete row?",
        body: (
          <>
            Row path:
            <br />
            <code style={{ userSelect: "all", wordBreak: "break-all" }}>
              {row._rowy_ref.path}
            </code>
          </>
        ),
        confirm: "Delete",
        confirmColor: "error",
        handleConfirm: _delete,
      });
    }
  };

  const handleClearValue = () => {
    const clearValue = () => {
      updateField({
        path: selectedCell.path,
        fieldName: selectedColumn.fieldName,
        arrayTableData: {
          index: selectedCell.arrayIndex,
        },
        value: null,
        deleteField: true,
      });
      onClose();
    };

    if (altPress || row._rowy_ref.arrayTableData !== undefined) {
      clearValue();
    } else {
      confirm({
        title: "Clear cell value?",
        body: "The cell’s value cannot be recovered after",
        confirm: "Delete",
        confirmColor: "error",
        handleConfirm: clearValue,
      });
    }
  };

  const rowActions: IContextMenuItem[] = [
    {
      label: "Copy ID",
      icon: <CopyIcon />,
      onClick: () => {
        navigator.clipboard.writeText(row._rowy_ref.id);
        onClose();
      },
    },
    {
      label: "Copy path",
      icon: <CopyIcon />,
      onClick: () => {
        navigator.clipboard.writeText(row._rowy_ref.path);
        onClose();
      },
    },
    {
      label: "Open in Firebase Console",
      icon: <OpenIcon />,
      onClick: () => {
        window.open(
          `https://console.firebase.google.com/project/${projectId}/firestore/data/~2F${row._rowy_ref.path.replace(
            /\//g,
            "~2F"
          )}`
        );
        onClose();
      },
    },
    { label: "Divider", divider: true },
    {
      label: "Duplicate",
      icon: <DuplicateIcon />,
      disabled:
        tableSettings.tableType === "collectionGroup" ||
        (!userRoles.includes("ADMIN") && tableSettings.readOnly),
      onClick: handleDuplicate,
    },
    {
      label: altPress ? "Delete" : "Delete…",
      color: "error",
      icon: <DeleteIcon />,
      disabled: !userRoles.includes("ADMIN") && tableSettings.readOnly,
      onClick: handleDelete,
    },
  ];

  if (selectedColumn) {
    const menuActions = getFieldProp(
      "contextMenuActions",
      selectedColumn?.type
    );

    // Field type actions
    const fieldTypeActions = menuActions
      ? menuActions(selectedCell, onClose)
      : [];
    if (fieldTypeActions.length > 0) actionGroups.push(fieldTypeActions);

    if (selectedColumn?.type === FieldType.derivative) {
      const renderedFieldMenuActions = getFieldProp(
        "contextMenuActions",
        selectedColumn.config?.renderFieldType
      );
      if (renderedFieldMenuActions) {
        actionGroups.push(renderedFieldMenuActions(selectedCell, onClose));
      }
    }

    // Cell actions
    // TODO: Add copy and paste here

    const selectedColumnKey = selectedCell.columnKey;
    const selectedColumnKeySplit = selectedColumnKey.split(".");

    const getNestedFieldValue = (object: TableRow, keys: string[]) => {
      let value = object;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (value && typeof value === "object" && key in value) {
          value = value[key];
        } else {
          // Handle cases where the key does not exist in the nested structure
          return undefined;
        }
      }

      return value;
    };

    const cellValue = getNestedFieldValue(row, selectedColumnKeySplit);

    const columnFilters = getFieldProp(
      "filter",
      selectedColumn?.type === FieldType.derivative
        ? selectedColumn.config?.renderFieldType
        : selectedColumn?.type
    );
    const handleFilterBy = () => {
      const filters = [
        {
          key: selectedColumn.fieldName,
          operator: columnFilters!.operators[0]?.value || "==",
          value: cellValue,
          id: generateId(),
        },
      ];

      if (updateUserSettings) {
        updateUserSettings({ tables: { [`${tableId}`]: { filters } } });
      }
      onClose();
    };
    const cellActions = [
      {
        label: altPress ? "Clear value" : "Clear value…",
        color: "error",
        icon: <ClearIcon />,
        disabled:
          selectedColumn?.editable === false ||
          !row ||
          cellValue === undefined ||
          getFieldProp("group", selectedColumn?.type) === "Auditing",
        onClick: handleClearValue,
      },
      {
        label: "Filter by",
        icon: <FilterIcon />,
        disabled: !columnFilters || cellValue === undefined,
        onClick: handleFilterBy,
      },
    ];
    actionGroups.push(cellActions);

    // Row actions as sub-menu
    actionGroups.push([
      {
        label: "Row",
        icon: <RowIcon />,
        subItems: rowActions,
      },
    ]);
  } else {
    actionGroups.push(rowActions);
  }

  return (
    <>
      {actionGroups.map((items, groupIndex) => (
        <Fragment key={groupIndex}>
          {groupIndex > 0 && <Divider variant="middle" />}
          {items.map((item, index: number) => (
            <ContextMenuItem
              key={`contextMenu-${groupIndex}-${index}`}
              {...item}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
}
