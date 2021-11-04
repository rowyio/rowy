import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import CreatedByIcon from "@src/assets/icons/CreatedBy";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-CreatedBy" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-CreatedBy" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-CreatedBy" */)
);

export const config: IFieldConfig = {
  type: FieldType.createdBy,
  name: "Created By",
  group: "Auditing",
  dataType:
    "{ displayName: string; email: string; emailVerified: boolean; isAnonymous: boolean; photoURL: string; uid: string; timestamp: firebase.firestore.Timestamp; }",
  initialValue: null,
  icon: <CreatedByIcon />,
  description:
    "Displays the user that created the row and timestamp. Read-only.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
  settings: Settings,
};
export default config;
