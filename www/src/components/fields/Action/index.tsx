import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import ActionIcon from "assets/icons/Action";
import BasicCell from "./BasicCell";
import NullEditor from "components/Table/editors/NullEditor";

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
  dataType: "any",
  initialValue: {},
  icon: <ActionIcon />,
  description:
    "A button with a pre-defined action. Triggers a Cloud Function. 3 different states: Disabled, Enabled, Active (Clicked). Supports Undo and Redo.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
  settings: Settings,
  requireConfiguration: true,
};
export default config;
