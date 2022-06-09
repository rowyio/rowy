import { useAtom } from "jotai";
import { find, get } from "lodash-es";
import { useSnackbar } from "notistack";

import Thumbnail from "@src/components/Thumbnail";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import { Copy } from "@src/assets/icons";

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

  const handleCopyImageURL = (imgObj: RowyFile) => () => {
    navigator.clipboard.writeText(imgObj.downloadURL);
    enqueueSnackbar("Copied image URL");
    reset();
  };
  const handleViewImage = (imgObj: RowyFile) => () => {
    window.open(imgObj.downloadURL, "_blank");
    reset();
  };

  return [
    {
      label: "Copy image URL",
      icon: <Copy />,
      onClick: isSingleValue ? handleCopyImageURL(cellValue[0]) : undefined,
      disabled: isEmpty,
      subItems: isSingleValue
        ? []
        : cellValue.map((imgObj: RowyFile, index: number) => ({
            label: imgObj.name || "Image " + (index + 1),
            icon: (
              <Thumbnail
                imageUrl={imgObj.downloadURL}
                size="100x100"
                objectFit="contain"
                sx={{
                  width: 24,
                  height: 24,
                  boxShadow: (theme) =>
                    `0 0 0 1px ${theme.palette.divider} inset`,
                }}
              />
            ),
            onClick: handleCopyImageURL(imgObj),
          })),
    },
    {
      label: "View image",
      icon: <OpenIcon />,
      onClick: isSingleValue ? handleViewImage(cellValue[0]) : undefined,
      disabled: isEmpty,
      subItems: isSingleValue
        ? []
        : cellValue.map((imgObj: RowyFile, index: number) => ({
            label: imgObj.name || "Image " + (index + 1),
            icon: (
              <Thumbnail
                imageUrl={imgObj.downloadURL}
                size="100x100"
                objectFit="contain"
                sx={{
                  width: 24,
                  height: 24,
                  boxShadow: (theme) =>
                    `0 0 0 1px ${theme.palette.divider} inset`,
                }}
              />
            ),
            onClick: handleViewImage(imgObj),
          })),
    },
  ];
};

export default ContextMenuActions;
