import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import DurationIcon from "@material-ui/icons/Timer";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";

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
  name: "Duration",
  dataType:
    "{ start: firebase.firestore.Timestamp, end?: firebase.firestore.Timestamp }",
  initialValue: {},
  icon: <DurationIcon />,
  description: "Duration calculated from two timestamps.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
