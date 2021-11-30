import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";
import { parseJSON, format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

import DateTimeIcon from "@mui/icons-material/AccessTime";
import BasicCell from "./BasicCell";
import NullEditor from "@src/components/Table/editors/NullEditor";
import { filterOperators, valueFormatter } from "./Filter";

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
  description: `Formatted date & time. Format is configurable, default: ${DATE_TIME_FORMAT}. Edited with a visual picker.`,
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
  filter: {
    operators: filterOperators,
    valueFormatter,
  },
  settings: Settings,
  csvImportParser: (value) => parseJSON(value).getTime(),
  csvExportFormatter: (value: any, config?: any) =>
    format(value.toDate(), config?.format ?? DATE_TIME_FORMAT),
};
export default config;

export { DateTimeIcon };
