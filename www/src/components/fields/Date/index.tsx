import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";
import { parseJSON } from "date-fns";

import DateIcon from "@material-ui/icons/Today";
import BasicCell from "./BasicCell";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Date" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Date" */)
);

export const config: IFieldConfig = {
  type: FieldType.date,
  name: "Date",
  dataType: "boolean",
  initialValue: false,
  icon: <DateIcon />,
  description:
    "Date displayed and input as YYYY/MM/DD or input using a picker module.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: NullEditor,
  SideDrawerField,
  csvImportParser: (value) => parseJSON(value).getTime(),
};
export default config;

export { DateIcon };
