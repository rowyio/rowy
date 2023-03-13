import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import UserIcon from "@mui/icons-material/PersonOutlined";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-User" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-User" */)
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
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
    transparentPopover: true,
  }),
  SideDrawerField,
  settings: Settings,
};
export default config;
