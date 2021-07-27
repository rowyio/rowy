import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";
import { parse, format } from "date-fns";
import { DATE_FORMAT } from "constants/dates";
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
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ConnectTable" */)
);

export const config: IFieldConfig = {
  type: FieldType.date,
  name: "Date",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  initializable: true,
  icon: <DateIcon />,
  description:
    "Date displayed and input by default as YYYY/MM/DD or input using a picker module.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
  settings: Settings,
  csvImportParser: (value, config) =>
    parse(value, config?.format ?? DATE_FORMAT, new Date()),
  csvExportFormatter: (value: any, config?: any) =>
    format(value.toDate(), config?.format ?? DATE_FORMAT),
};
export default config;

export { DateIcon };
