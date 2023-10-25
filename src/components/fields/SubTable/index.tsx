import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { SubTable as SubTableIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";

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
  TableCell: withRenderTableCell(DisplayCell, null, "focus", {
    usesRowData: true,
    disablePadding: true,
  }),
  SideDrawerField,
  initializable: false,
  requireConfiguration: true,
  requireCollectionTable: true,
};
export default config;
