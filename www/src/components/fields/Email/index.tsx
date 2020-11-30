import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import EmailIcon from "@material-ui/icons/Mail";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Email" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Email" */)
);

export const config: IFieldConfig = {
  type: FieldType.email,
  name: "Email",
  dataType: "string",
  initialValue: "",
  icon: <EmailIcon />,
  description: "Email address. Firetable does not validate emails.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
