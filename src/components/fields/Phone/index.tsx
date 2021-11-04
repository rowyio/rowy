import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "../ShortText/Filter";

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
  description: "Phone number stored as text. Not validated.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
};
export default config;
