import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import EmailIcon from "@material-ui/icons/Mail";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Email" */)
);

export const config: IFieldConfig = {
  type: FieldType.email,
  name: "Email",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <EmailIcon />,
  description: "Email address. Firetable does not validate emails.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
