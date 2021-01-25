import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import IdIcon from "assets/icons/Id";
import BasicCell from "../_BasicCell/BasicCellValue";
import SideDrawerEditor from "components/Table/editors/SideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Id" */)
);
const SideDrawerField = lazy(
  () => import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Id" */)
);

export const config: IFieldConfig = {
  type: FieldType.id,
  name: "ID",
  dataType: "undefined",
  initialValue: undefined,
  icon: <IdIcon />,
  description: "Displays the row’s document ID. Cannot be sorted.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: SideDrawerEditor,
  SideDrawerField,
};
export default config;
