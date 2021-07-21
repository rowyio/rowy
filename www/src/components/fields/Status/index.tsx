import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import StatusIcon from "assets/icons/Status";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Status" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Status" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Status" */)
);

export const config: IFieldConfig = {
  type: FieldType.status,
  name: "Status",
  dataType: "any",
  initialValue: undefined,
  initializable: true,
  icon: <StatusIcon />,
  description:
    "Status is read only field that displays field values in more visual format",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  settings: Settings,
  SideDrawerField,
  requireConfiguration: true,
};
export default config;
