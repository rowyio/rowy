import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import JsonIcon from "assets/icons/Json";
import BasicCell from "../_BasicCell/BasicCellNull";
import SideDrawerEditor from "components/Table/editors/SideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Json" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Json" */)
);

const Settings = lazy(
  () =>
    import("./Settings" /* webpackChunkName: "Settings-Json" */)
);

export const config: IFieldConfig = {
  type: FieldType.json,
  name: "JSON",
  dataType: "any",
  initialValue: undefined,
  initializable:true,
  icon: <JsonIcon />,
  description: "JSON object editable with a visual JSON editor.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: SideDrawerEditor,
  SideDrawerField,
  settings:Settings
};
export default config;
