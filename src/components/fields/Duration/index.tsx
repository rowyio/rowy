import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import DurationIcon from "@mui/icons-material/TimerOutlined";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Duration" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Duration" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.duration,
  name: "Duration (Alpha)",
  group: "Date & Time",
  dataType: "Record<'start' | 'end', firebase.firestore.Timestamp>",
  initialValue: {},
  icon: <DurationIcon />,
  description: "Duration calculated from two timestamps.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
};
export default config;
