import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";
import BasicCell from "../_BasicCell/BasicCellValue";
import SideDrawerEditor from "components/Table/editors/SideDrawerEditor";
import JsonIcon from "assets/icons/Json";
const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Json" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Json" */)
);

export const config: IFieldConfig = {
  type: FieldType.json,
  name: "JSON",
  dataType: "any",
  initialValue: "",
  icon: <JsonIcon />,
  description: "JSON object editable with a visual JSON editor.",
  TableCell: withCustomCell(TableCell, ({value,...props}) =>BasicCell({value:JSON.stringify(value),...props})),
  TableEditor: SideDrawerEditor,
  SideDrawerField,
};
export default config;
