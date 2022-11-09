import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import EmailIcon from "@mui/icons-material/MailOutlined";
import DisplayCell from "@src/components/fields/_BasicCell/BasicCellValue";
import EditorCell from "./EditorCell";
import { filterOperators } from "@src/components/fields/ShortText/Filter";
import BasicContextMenuActions from "@src/components/fields/_BasicCell/BasicCellContextMenuActions";

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
  TableCell: withTableCell(DisplayCell, EditorCell),
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
};
export default config;
