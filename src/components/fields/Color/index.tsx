import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { toColor } from "react-color-palette";

import ColorIcon from "@mui/icons-material/Colorize";
import DisplayCell from "./DisplayCell";
import { filterOperators, valueFormatter } from "./filters";

import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-Color" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Color" */)
);

export const config: IFieldConfig = {
  type: FieldType.color,
  name: "Color",
  group: "Numeric",
  dataType: "Record<string, any>",
  initialValue: {},
  initializable: true,
  icon: <ColorIcon />,
  description:
    "Color stored as Hex, RGB, and HSV. Edited with a visual picker.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
  }),
  SideDrawerField,
  csvImportParser: (value: string) => {
    try {
      const obj = JSON.parse(value);
      if ("hex" in obj) {
        return toColor("hex", obj.hex);
      }
      throw new Error();
    } catch (error) {
      console.error("Invalid color value");
      return null;
    }
  },
  contextMenuActions: BasicContextMenuActions,
};
export default config;
