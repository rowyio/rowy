import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import LongTextIcon from "@material-ui/icons/Notes";
import BasicCell from "../_BasicCell/BasicCellValue";
import SideDrawerEditor from "components/Table/editors/SideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-LongText" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-LongText" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.longText,
  name: "Short Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <LongTextIcon />,
  description: "Large amount of text, such as sentences and paragraphs.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: SideDrawerEditor,
  SideDrawerField,
};
export default config;
