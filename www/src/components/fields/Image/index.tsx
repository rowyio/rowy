import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import PhoneIcon from "@material-ui/icons/Phone";
import BasicCell from "../_BasicCell/BasicCellValue";
import NullEditor from "components/Table/editors/NullEditor";
import ImageIcon from "@material-ui/icons/PhotoSizeSelectActual";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Phone" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Phone" */)
);

export const config: IFieldConfig = {
  type: FieldType.image,
  name: "Image",
  dataType: "{downloadURL:string,lastModifiedTS:number,name:string,type,ref}[]",
  initialValue: "",
  icon: <ImageIcon />,
  description:"Image file uploaded to Firebase Storage. Supports JPEG, PNG, SVG, GIF, WebP.",
  TableCell: withCustomCell(TableCell, ()=><></>),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
