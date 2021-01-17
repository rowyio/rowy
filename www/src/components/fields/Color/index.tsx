import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withPopoverCell from "components/Table/withPopoverCell";

import ColorIcon from "@material-ui/icons/Colorize";
import PopoverBasicCell from "./PopoverBasicCell";
import NullEditor from "components/Table/editors/NullEditor";

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
  dataType: "Record<string, any>",
  initialValue: undefined,
  initializable: true,
  icon: <ColorIcon />,
  description: "Visual color picker. Supports Hex, RGBA, HSLA.",
  TableCell: withPopoverCell(PopoverCell, PopoverBasicCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
  }),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
