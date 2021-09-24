import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Phone" */)
);

export const config: IFieldConfig = {
  type: FieldType.phone,
  name: "Phone",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <PhoneIcon />,
  description: "Phone numbers stored as text.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
