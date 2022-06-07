import { useAtom } from "jotai";
import { find, get } from "lodash-es";
import { useSnackbar } from "notistack";

import { Copy } from "@src/assets/icons";
import {
  tableScope,
  tableSchemaAtom,
  tableRowsAtom,
} from "@src/atoms/tableScope";
import { IFieldConfig } from "@src/components/fields/types";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";

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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
  if (!selectedCol) return [];

  const selectedRow = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  const cellValue = get(selectedRow, selectedCol.fieldName);

  const isEmpty =
    cellValue === "" ||
    cellValue === null ||
    cellValue === undefined ||
    cellValue.length === 0;
  if (isEmpty)
    return [
      {
        label: "Copy Image URL",
        icon: <Copy />,
        disabled: true,
        onClick: () => {},
      },
      {
        label: "View Image",
        icon: <OpenIcon />,
        onClick: () => {},
        disabled: true,
      },
    ];

  const handleCopyImageURL = (imgObj: RowyFile) => () => {
    navigator.clipboard.writeText(imgObj.downloadURL);
    enqueueSnackbar("Copied image URL to clipboard", {
      variant: "success",
    });
  };
  const handleViewImage = (imgObj: RowyFile) => () => {
    window.open(imgObj.downloadURL, "_blank");
  };

  if (cellValue.length === 1)
    return [
      {
        label: "Copy Image URL",
        icon: <Copy />,
        onClick: handleCopyImageURL(cellValue[0]),
      },
      {
        label: "View Image",
        icon: <OpenIcon />,
        onClick: handleViewImage(cellValue[0]),
      },
    ];
  else
    return [
      {
        label: "Copy Image URL",
        //onClick: handleCopyImageURL,
        subItems: cellValue.map((imgObj: RowyFile, index: number) => ({
          label: "Image " + (index + 1),
          icon: <Copy />,
          onClick: handleCopyImageURL(imgObj),
        })),
      },
      {
        label: "View Image",
        subItems: cellValue.map((imgObj: RowyFile, index: number) => ({
          label: "Image " + (index + 1),
          icon: <OpenIcon />,
          onClick: handleViewImage(imgObj),
        })),
      },
    ];
};

export default ContextMenuActions;
