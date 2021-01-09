import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import FileIcon from "@material-ui/icons/AttachFile";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-File" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-File" */)
);

export const config: IFieldConfig = {
  type: FieldType.file,
  name: "File",
  dataType:
    "{ downloadURL: string, lastModifiedTS: number, name: string, type, ref }[]",
  initialValue: undefined,
  icon: <FileIcon />,
  description: "File uploaded to Firebase Storage. Supports any file type.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
