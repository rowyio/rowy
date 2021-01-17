import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import UrlIcon from "@material-ui/icons/Link";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Url" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Url" */)
);

export const config: IFieldConfig = {
  type: FieldType.url,
  name: "URL",
  dataType: "string",
  initialValue: "",
  initializable:true,
  icon: <UrlIcon />,
  description: "Web address. Firetable does not validate URLs.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
