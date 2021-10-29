import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import UpdatedAtIcon from "@src/assets/icons/UpdatedAt";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-UpdatedAt" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-UpdatedAt" */
    )
);
const Settings = lazy(
  () =>
    import("../CreatedBy/Settings" /* webpackChunkName: "Settings-CreatedBy" */)
);

export const config: IFieldConfig = {
  type: FieldType.updatedAt,
  name: "Updated At",
  group: "Auditing",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  icon: <UpdatedAtIcon />,
  description:
    "Displays the timestamp of the last update to the row. Read-only.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
  settings: Settings,
};
export default config;
