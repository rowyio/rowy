import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import RichTextIcon from "@material-ui/icons/TextFormat";
import BasicCell from "../_BasicCell/BasicCellNull";
import SideDrawerEditor from "components/Table/editors/SideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-RichText" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-RichText" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.richText,
  name: "Rich Text",
  dataType: "string",
  initialValue: undefined,
  icon: <RichTextIcon />,
  description: "Rich text editor with predefined HTML text styles.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: SideDrawerEditor,
  SideDrawerField,
};
export default config;
