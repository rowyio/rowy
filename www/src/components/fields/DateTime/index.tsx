import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";
import { parseJSON } from "date-fns";

import DateTimeIcon from "@material-ui/icons/AccessTime";
import BasicCell from "./BasicCell";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-DateTime" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-DateTime" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.dateTime,
  name: "Time & Date",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  initializable: true,
  icon: <DateTimeIcon />,
  description:
    "Time and Date can be written as YYYY/MM/DD hh:mm (am/pm) or input using a picker module.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
  csvImportParser: (value) => parseJSON(value).getTime(),
};
export default config;

export { DateTimeIcon };
