import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import PhoneIcon from "@material-ui/icons/Phone";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Phone" */)
);

export const config: IFieldConfig = {
  type: FieldType.phone,
  name: "Phone",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <PhoneIcon />,
  description:
    "Phone numbers stored as text. Firetable does not validate phone numbers.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
