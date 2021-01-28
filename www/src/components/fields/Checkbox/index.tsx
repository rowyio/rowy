import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import CheckboxIcon from "@material-ui/icons/CheckBox";
import BasicCell from "../_BasicCell/BasicCellName";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Checkbox" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Checkbox" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.checkbox,
  name: "Checkbox",
  dataType: "boolean",
  initialValue: false,
  initializable: true,
  icon: <CheckboxIcon />,
  description: "Either checked or unchecked. Unchecked by default.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
