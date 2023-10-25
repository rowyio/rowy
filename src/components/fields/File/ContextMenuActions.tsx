import { useAtom } from "jotai";
import { find, get } from "lodash-es";
import { useSnackbar } from "notistack";

import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import { Copy } from "@src/assets/icons";
import { FileIcon } from ".";

import {
  tableScope,
  tableSchemaAtom,
  tableRowsAtom,
} from "@src/atoms/tableScope";
import { IFieldConfig } from "@src/components/fields/types";

export interface IContextMenuActions {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const ContextMenuActions: IFieldConfig["contextMenuActions"] = (
  selectedCell,
  reset
) => {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const { enqueueSnackbar } = useSnackbar();

  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
  if (!selectedCol) return [];

  const selectedRow = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  const cellValue = get(selectedRow, selectedCol.fieldName) || [];

  const isEmpty =
    cellValue === "" ||
    cellValue === null ||
    cellValue === undefined ||
    cellValue.length === 0;
  const isSingleValue = isEmpty || cellValue?.length === 1;

  const handleCopyFileURL = (fileObj: RowyFile) => () => {
    navigator.clipboard.writeText(fileObj.downloadURL);
    enqueueSnackbar("Copied file URL");
    reset();
  };
  const handleViewFile = (fileObj: RowyFile) => () => {
    window.open(fileObj.downloadURL, "_blank");
    reset();
  };

  return [
    {
      label: "Copy file URL",
      icon: <Copy />,
      onClick: isSingleValue ? handleCopyFileURL(cellValue[0]) : undefined,
      disabled: isEmpty,
      subItems: isSingleValue
        ? []
        : cellValue.map((fileObj: RowyFile, index: number) => ({
            label: fileObj.name || "File " + (index + 1),
            icon: <FileIcon />,
            onClick: handleCopyFileURL(fileObj),
          })),
    },
    {
      label: "View file",
      icon: <OpenIcon />,
      onClick: isSingleValue ? handleViewFile(cellValue[0]) : undefined,
      disabled: isEmpty,
      subItems: isSingleValue
        ? []
        : cellValue.map((fileObj: RowyFile, index: number) => ({
            label: fileObj.name || "File " + (index + 1),
            icon: <FileIcon />,
            onClick: handleViewFile(fileObj),
          })),
    },
  ];
};

export default ContextMenuActions;
