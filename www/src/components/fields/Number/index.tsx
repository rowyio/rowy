import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import NumberIcon from "assets/icons/Number";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Number" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Number" */)
);

export const config: IFieldConfig = {
  type: FieldType.number,
  name: "Number",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <NumberIcon />,
  description: "Numeric data.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
