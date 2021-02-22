import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withPopoverCell from "../_withTableCell/withPopoverCell";

import MultiSelectIcon from "assets/icons/MultiSelect";
import BasicCell from "../_BasicCell/BasicCellNull";
import InlineCell from "./InlineCell";
import NullEditor from "components/Table/editors/NullEditor";

const PopoverCell = lazy(
  () =>
    import("./PopoverCell" /* webpackChunkName: "PopoverCell-MultiSelect" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-MultiSelect" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.multiSelect,
  name: "Multi Select",
  dataType: "string[]",
  initialValue: [],
  initializable: true,
  icon: <MultiSelectIcon />,
  description:
    "Dropdown selector with searchable options and check box behavior. Optionally allows users to input custom values. Max selection: all options.",
  TableCell: withPopoverCell(BasicCell, InlineCell, PopoverCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
