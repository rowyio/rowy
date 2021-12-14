import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import ActionIcon from "@mui/icons-material/TouchAppOutlined";
import BasicCell from "./BasicCell";
import NullEditor from "@src/components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Action" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Action" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Action" */)
);
export const config: IFieldConfig = {
  type: FieldType.action,
  name: "Action",
  group: "Cloud Function",
  dataType: "any",
  initialValue: {},
  icon: <ActionIcon />,
  description:
    "Button with pre-defined action script or triggers a Cloud Function. Optionally supports Undo and Redo.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
  settings: Settings,
  requireConfiguration: true,
  sortKey: "status",
};
export default config;
