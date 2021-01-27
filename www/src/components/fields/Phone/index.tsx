import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import PhoneIcon from "@material-ui/icons/Phone";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Phone" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Phone" */)
);

export const config: IFieldConfig = {
  type: FieldType.phone,
  name: "Phone",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <PhoneIcon />,
  description:
    "Phone numbers stored as text. Firetable does not validate phone numbers.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
