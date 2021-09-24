import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";
import { parseJSON, format } from "date-fns";
import { DATE_TIME_FORMAT } from "constants/dates";

import DateTimeIcon from "@mui/icons-material/AccessTime";
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
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-DateTime" */)
);

export const config: IFieldConfig = {
  type: FieldType.dateTime,
  name: "Date & Time",
  group: "Date & Time",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  initializable: true,
  icon: <DateTimeIcon />,
  description: `Date & Time displayed by default as ${DATE_TIME_FORMAT}.`,
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
  settings: Settings,
  csvImportParser: (value) => parseJSON(value).getTime(),
  csvExportFormatter: (value: any, config?: any) =>
    format(value.toDate(), config?.format ?? DATE_TIME_FORMAT),
};
export default config;

export { DateTimeIcon };
