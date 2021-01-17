import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import CodeIcon from "@material-ui/icons/Code";
import BasicCell from "../_BasicCell/BasicCellNull";
import SideDrawerEditor from "components/Table/editors/SideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Code" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Code" */)
);

export const config: IFieldConfig = {
  type: FieldType.code,
  name: "Code",
  dataType: "string",
  initialValue: undefined,
  initializable: true,
  icon: <CodeIcon />,
  description: "Raw code editable with Monaco Editor.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: SideDrawerEditor,
  SideDrawerField,
};
export default config;
