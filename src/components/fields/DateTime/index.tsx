import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";
import { parseJSON, format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

import DateTimeIcon from "@mui/icons-material/AccessTime";
import DisplayCell from "./DisplayCell";
import { filterOperators, valueFormatter } from "./filters";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-DateTime" */)
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
const FilterCustomInput = lazy(
  () =>
    import(
      "./FilterCustomInput" /* webpackChunkName: "FilterCustomInput-DateTime" */
    )
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
  TableCell: withTableCell(DisplayCell, EditorCell, "inline", {
    disablePadding: true,
  }),
  SideDrawerField,
  filter: {
    operators: filterOperators,
    valueFormatter,
    customInput: FilterCustomInput,
  },
  settings: Settings,
  csvImportParser: (value) => parseJSON(value).getTime(),
  csvExportFormatter: (value: any, config?: any) =>
    format(value.toDate(), config?.format ?? DATE_TIME_FORMAT),
};
export default config;

export { DateTimeIcon };
