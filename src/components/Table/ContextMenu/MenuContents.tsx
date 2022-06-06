import { useAtom, useSetAtom } from "jotai";
import { getFieldProp } from "@src/components/fields";
import { find } from "lodash-es";

import { Divider } from "@mui/material";
import {
  CopyCells as DuplicateIcon,
  Clear as ClearIcon,
} from "@src/assets/icons";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import MenuItem from "./MenuItem";

import {
  globalScope,
  altPressAtom,
  tableAddRowIdTypeAtom,
  confirmDialogAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  tableRowsAtom,
  selectedCellAtom,
  addRowAtom,
  deleteRowAtom,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { IContextMenuItem } from "./MenuItem";
import { FieldType } from "@src/constants/fields";

interface IMenuContentsProps {
  onClose: () => void;
}

export default function MenuContents({ onClose }: IMenuContentsProps) {
  const [altPress] = useAtom(altPressAtom, globalScope);
  const [addRowIdType] = useAtom(tableAddRowIdTypeAtom, globalScope);
  const confirm = useSetAtom(confirmDialogAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  const deleteRow = useSetAtom(deleteRowAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  if (!tableSchema.columns || !selectedCell) return null;

  const selectedColumn = tableSchema.columns[selectedCell.columnKey];
  const menuActions = getFieldProp("contextMenuActions", selectedColumn.type);

  const actionGroups: IContextMenuItem[][] = [];

  // Field type actions
  const fieldTypeActions = menuActions
    ? menuActions(selectedCell, onClose)
    : [];
  if (fieldTypeActions.length > 0) actionGroups.push(fieldTypeActions);

  if (selectedColumn.type === FieldType.derivative) {
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
  const handleClearValue = () =>
    updateField({
      path: selectedCell.path,
      fieldName: selectedColumn.fieldName,
      value: null,
      deleteField: true,
    });
  const cellActions = [
    {
      label: altPress ? "Clear value" : "Clear value…",
      color: "error",
      icon: <ClearIcon />,
      onClick: altPress
        ? handleClearValue
        : () => {
            confirm({
              title: "Clear cell value?",
              body: "The cell’s value cannot be recovered after",
              confirm: "Delete",
              confirmColor: "error",
              handleConfirm: handleClearValue,
            });
            onClose();
          },
    },
  ];
  actionGroups.push(cellActions);

  // Row actions
  const row = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  if (row) {
    const handleDelete = () => deleteRow(row._rowy_ref.path);
    const rowActions = [
      {
        label: "Duplicate row",
        icon: <DuplicateIcon />,
        disabled: tableSettings.tableType === "collectionGroup",
        onClick: () => {
          addRow({
            row,
            setId: addRowIdType === "custom" ? "decrement" : addRowIdType,
          });
          onClose();
        },
      },
      {
        label: altPress ? "Delete row" : "Delete row…",
        color: "error",
        icon: <DeleteIcon />,
        onClick: altPress
          ? handleDelete
          : () => {
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
                handleConfirm: handleDelete,
              });
              onClose();
            },
      },
    ];
    actionGroups.push(rowActions);
  }

  return (
    <>
      {actionGroups.map((items, groupIndex) => (
        <>
          {groupIndex > 0 && <Divider variant="middle" />}
          {items.map((item, index: number) => (
            <MenuItem key={`contextMenu-${groupIndex}-${index}`} {...item} />
          ))}
        </>
      ))}
    </>
  );
}
