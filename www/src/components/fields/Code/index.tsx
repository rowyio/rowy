import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";
import BasicCell from "../_BasicCell/BasicCellValue";
import CodeIcon from "@material-ui/icons/Code";
import SideDrawerEditor from "components/Table/editors/SideDrawerEditor";
const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-richText" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-richText" */)
);

export const config: IFieldConfig = {
  type: FieldType.code,
  name: "Code",
  dataType: "string",
  initialValue: "",
  icon: <CodeIcon />,
  description: "Raw code editable with Monaco Editor.",
  TableCell: withCustomCell(TableCell,BasicCell),
  TableEditor: SideDrawerEditor,
  SideDrawerField,
};
export default config;
