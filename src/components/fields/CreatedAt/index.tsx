import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import CreatedAtIcon from "@src/assets/icons/CreatedAt";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-CreatedAt" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-CreatedAt" */
    )
);
const Settings = lazy(
  () =>
    import("../CreatedBy/Settings" /* webpackChunkName: "Settings-CreatedBy" */)
);

export const config: IFieldConfig = {
  type: FieldType.createdAt,
  name: "Created At",
  group: "Auditing",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  icon: <CreatedAtIcon />,
  description: "Displays the timestamp of when the row was created. Read-only.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
  settings: Settings,
};
export default config;
