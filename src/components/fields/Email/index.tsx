import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import EmailIcon from "@mui/icons-material/MailOutlined";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Email" */)
);

export const config: IFieldConfig = {
  type: FieldType.email,
  name: "Email",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <EmailIcon />,
  description: "Email address. Not validated.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
