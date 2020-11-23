import React from "react";
import { IFieldConfig, FieldType } from "../types";
import withCustomCell from "../withCustomCell";

import CheckboxIcon from "@material-ui/icons/CheckBox";
import TableCell from "./TableCell";
import BasicCell from "./BasicCell";
import NullEditor from "components/Table/editors/NullEditor";
import SideDrawerField from "./SideDrawerField";

export const config: IFieldConfig = {
  type: FieldType.checkbox,
  name: "Checkbox",
  dataType: "boolean",
  initialValue: false,
  icon: <CheckboxIcon />,
  description: "Either checked or unchecked. Unchecked by default.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
