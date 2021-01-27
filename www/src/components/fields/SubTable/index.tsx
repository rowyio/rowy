import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import SubTableIcon from "assets/icons/SubTable";
import BasicCell from "../_BasicCell/BasicCellName";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-SubTable" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-SubTable" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.subTable,
  name: "SubTable",
  dataType: "undefined",
  initialValue: null,
  icon: <SubTableIcon />,
  description:
    "Creates a sub-table. Also displays number of rows inside the sub-table. Max sub-table levels: 100.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
