import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";
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
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  initializable: true,
  icon: <DateIcon />,
  description:
    "Date displayed and input as YYYY/MM/DD or input using a picker module.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
  csvImportParser: (value) => parseJSON(value).getTime(),
};
export default config;

export { DateIcon };
