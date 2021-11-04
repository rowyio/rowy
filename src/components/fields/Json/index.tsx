import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import JsonIcon from "@src/assets/icons/Json";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

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
};
export default config;
