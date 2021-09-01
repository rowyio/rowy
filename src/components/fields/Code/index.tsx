import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import CodeIcon from "@material-ui/icons/Code";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "components/Table/editors/withSideDrawerEditor";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Code" */)
);

export const config: IFieldConfig = {
  type: FieldType.code,
  name: "Code",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <CodeIcon />,
  description: "Raw code editable with Monaco Editor.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: withSideDrawerEditor(BasicCell),
  SideDrawerField,
};
export default config;
