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
  type: FieldType.richText,
  name: "Rich Text",
  dataType: "string",
  initialValue: "",
  icon: <RichTextIcon />,
  description: "Rich text editor with predefined HTML text styles.",
  TableCell: withCustomCell(TableCell, ()=><></>),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
