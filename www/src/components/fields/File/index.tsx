import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";
import NullEditor from "components/Table/editors/NullEditor";
import FileIcon from "@material-ui/icons/AttachFile";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Phone" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Phone" */)
);

export const config: IFieldConfig = {
  type: FieldType.file,
  name: "File",
  dataType: "{downloadURL:string,lastModifiedTS:number,name:string,type,ref}[]",
  initialValue: "",
  icon: <FileIcon />,
  description:"File uploaded to Firebase Storage. Supports any file type.",
  TableCell: withCustomCell(TableCell, ()=><></>),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
