import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import SubTableIcon from "@src/assets/icons/SubTable";
import BasicCell from "../_BasicCell/BasicCellName";
import NullEditor from "@src/components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-SubTable" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-SubTable" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Subtable" */)
);
export const config: IFieldConfig = {
  type: FieldType.subTable,
  name: "Sub-Table",
  group: "Connection",
  dataType: "undefined",
  initialValue: null,
  icon: <SubTableIcon />,
  settings: Settings,
  description:
    "Connects to a sub-table in the current row. Also displays number of rows inside the sub-table. Max sub-table depth: 100.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
  initializable: false,
  requireConfiguration: true,
};
export default config;
