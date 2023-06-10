import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import { parse, format } from "date-fns";
import { DATE_FORMAT } from "@src/constants/dates";

import DateIcon from "@mui/icons-material/TodayOutlined";
import DisplayCell from "./DisplayCell";
import { filterOperators, valueFormatter } from "./filters";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

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
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "focus", {
    disablePadding: true,
  }),
  SideDrawerField,
  filter: { operators: filterOperators, valueFormatter },
  settings: Settings,
  csvImportParser: (value, config) => parse(value, DATE_FORMAT, new Date()),
  csvExportFormatter: (value: any, config?: any) => {
    if (typeof value === "number") {
      return format(new Date(value), DATE_FORMAT);
    } else {
      return format(value.toDate(), DATE_FORMAT);
    }
  },
  contextMenuActions: BasicContextMenuActions,
};
export default config;

export { DateIcon };
