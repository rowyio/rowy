import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import PercentageIcon from "assets/icons/Percentage";
import BasicCell from "../_BasicCell/BasicCellNull";
import TextEditor from "components/Table/editors/TextEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Percentage" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Percentage" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.percentage,
  name: "Percentage",
  dataType: "number",
  initialValue: undefined,
  initializable: true,
  icon: <PercentageIcon />,
  description: "Percentage stored as a number between 0 and 1.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
