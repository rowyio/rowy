import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

import { Markdown as MarkdownIcon } from "@src/assets/icons";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-markdown" */)
);

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-markdown" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.markdown,
  name: "Markdown",
  group: "Code",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <MarkdownIcon />,
  description: "Markdown editor with preview",
  TableCell: withBasicCell(BasicCell),
  TableEditor: withSideDrawerEditor(BasicCell),
  SideDrawerField,
  settings: Settings,
};
export default config;
