import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import UserIcon from "@mui/icons-material/PersonOutlined";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-User" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-User" */)
);
const Settings = lazy(
  () =>
    import("../CreatedBy/Settings" /* webpackChunkName: "Settings-CreatedBy" */)
);

export const config: IFieldConfig = {
  type: FieldType.user,
  name: "User",
  group: "Metadata",
  dataType:
    "{ displayName: string; email: string; emailVerified: boolean; isAnonymous: boolean; photoURL: string; uid: string; timestamp?: firebase.firestore.Timestamp; }",
  initialValue: null,
  icon: <UserIcon />,
  description: "User information and optionally, timestamp. Read-only.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
  settings: Settings,
};
export default config;
