import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import ShortTextIcon from "@material-ui/icons/ShortText";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-ShortText" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-ShortText" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ShortText" */)
);

export const config: IFieldConfig = {
  type: FieldType.shortText,
  name: "Short Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <ShortTextIcon />,
  description: "Small amount of text, such as names and taglines.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
  settings: Settings,
};
export default config;
