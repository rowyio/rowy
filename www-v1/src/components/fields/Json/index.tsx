import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import JsonIcon from "assets/icons/Json";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "components/Table/editors/withSideDrawerEditor";

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
  dataType: "any",
  initialValue: {},
  initializable: true,
  icon: <JsonIcon />,
  description: "JSON object editable with a visual JSON editor.",
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
