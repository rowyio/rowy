import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";
import BasicCell from "../_BasicCell/BasicCellValue";
import NullEditor from "components/Table/editors/NullEditor";
import RichTextIcon from "@material-ui/icons/TextFormat";
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
  icon: <RichTextIcon />,
  description: "Raw code editable with Monaco Editor.",
  TableCell: withCustomCell(TableCell, ()=><></>),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
