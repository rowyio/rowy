import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import SubTableIcon from "assets/icons/SubTable";
import BasicCell from "../_BasicCell/BasicCellName";
import NullEditor from "components/Table/editors/NullEditor";

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
  name: "SubTable",
  dataType: "undefined",
  initialValue: null,
  icon: <SubTableIcon />,
  settings: Settings,
  description:
    "Creates a sub-table. Also displays number of rows inside the sub-table. Max sub-table levels: 100.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
  initializable: false,
  requireConfiguration: true,
};
export default config;
