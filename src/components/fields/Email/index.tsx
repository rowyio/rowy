import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import EmailIcon from "@mui/icons-material/MailOutlined";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "../ShortText/Filter";
import BasicContextMenuActions from "../_BasicCell/BasicCellContextMenuActions";

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
  contextMenuActions: BasicContextMenuActions,
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
};
export default config;
