import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import CodeIcon from "@mui/icons-material/Code";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ConnectService" */)
);

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Code" */)
);

export const config: IFieldConfig = {
  type: FieldType.code,
  name: "Code",
  group: "Code",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <CodeIcon />,
  description: "Raw code edited with the Monaco Editor.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: withSideDrawerEditor(BasicCell),
  SideDrawerField,
  settings: Settings,
};
export default config;
