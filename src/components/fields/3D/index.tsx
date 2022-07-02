import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

import { _3D as _3DIcon } from "@src/assets/icons";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-3d" */)
);

const SideDrawerField = lazy(
  () => import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-3d" */)
);

export const config: IFieldConfig = {
  type: FieldType["3d"],
  name: "3D",
  group: "File",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <_3DIcon />,
  description: "3D model",
  TableCell: withBasicCell(BasicCell),
  TableEditor: withSideDrawerEditor(BasicCell),
  SideDrawerField,
  settings: Settings,
};
export default config;
