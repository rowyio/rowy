import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";
import { parse, format } from "date-fns";
import { DATE_FORMAT } from "@src/constants/dates";

import DateIcon from "@mui/icons-material/TodayOutlined";
import DisplayCell from "./DisplayCell";
import { filterOperators, valueFormatter } from "./filters";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-Date" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Date" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Date" */)
);

export const config: IFieldConfig = {
  type: FieldType.date,
  name: "Date",
  group: "Date & Time",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  initializable: true,
  icon: <DateIcon />,
  description: `Formatted date. Format is configurable, default: ${DATE_FORMAT}. Edited with a visual picker.`,
  TableCell: withTableCell(DisplayCell, EditorCell, "inline", {
    disablePadding: true,
  }),
  SideDrawerField,
  filter: { operators: filterOperators, valueFormatter },
  settings: Settings,
  csvImportParser: (value, config) =>
    parse(value, config?.format ?? DATE_FORMAT, new Date()),
  csvExportFormatter: (value: any, config?: any) =>
    format(value.toDate(), config?.format ?? DATE_FORMAT),
};
export default config;

export { DateIcon };
