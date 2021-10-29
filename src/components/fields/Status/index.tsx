import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import StatusIcon from "@src/assets/icons/Status";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";

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
  group: "Cloud Function",
  dataType: "any",
  initialValue: undefined,
  initializable: true,
  icon: <StatusIcon />,
  description: "Displays field value as custom status text. Read-only.	",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  settings: Settings,
  SideDrawerField,
  requireConfiguration: true,
};
export default config;
