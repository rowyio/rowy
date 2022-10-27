import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withPopoverCell from "@src/components/fields/_withTableCell/withPopoverCell";
import { toColor } from "react-color-palette";

import ColorIcon from "@mui/icons-material/Colorize";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellNull";
import InlineCell from "./InlineCell";
import NullEditor from "@src/components/Table/editors/NullEditor";

const PopoverCell = lazy(
  () => import("./PopoverCell" /* webpackChunkName: "PopoverCell-Color" */)
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
  TableCell: withPopoverCell(BasicCell, InlineCell, PopoverCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
  }),
  TableEditor: NullEditor as any,
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
};
export default config;
