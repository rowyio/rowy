import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import IdIcon from "assets/icons/Id";
import BasicCell from "../_BasicCell/BasicCellValue";
import withSideDrawerEditor from "components/Table/editors/withSideDrawerEditor";

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
  initialValue: "",
  icon: <IdIcon />,
  description: "Displays the row’s document ID. Cannot be sorted.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
};
export default config;
