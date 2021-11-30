import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";
import { parse, format } from "date-fns";
import { DATE_FORMAT } from "@src/constants/dates";

import DateIcon from "@mui/icons-material/TodayOutlined";
import BasicCell from "./BasicCell";
import NullEditor from "@src/components/Table/editors/NullEditor";
import { filterOperators, valueFormatter } from "./Filter";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Date" */)
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
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
  filter: {
    operators: filterOperators,
    valueFormatter,
  },
  settings: Settings,
  csvImportParser: (value, config) =>
    parse(value, config?.format ?? DATE_FORMAT, new Date()),
  csvExportFormatter: (value: any, config?: any) =>
    format(value.toDate(), config?.format ?? DATE_FORMAT),
};
export default config;

export { DateIcon };
