import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

import { Json as JsonIcon } from "@src/assets/icons";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";
import ContextMenuActions from "./ContextMenuActions";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Json" */)
);

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Json" */)
);

export const config: IFieldConfig = {
  type: FieldType.json,
  name: "JSON",
  group: "Code",
  dataType: "object",
  initialValue: undefined,
  initializable: true,
  icon: <JsonIcon />,
  description: "Object edited with a visual JSON editor.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: withSideDrawerEditor(BasicCell),
  csvImportParser: (value) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  },
  SideDrawerField,
  settings: Settings,
  contextMenuActions: ContextMenuActions,
};
export default config;
