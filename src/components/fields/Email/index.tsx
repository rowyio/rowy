import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

import EmailIcon from "@mui/icons-material/MailOutlined";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellValue";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "@src/components/fields/ShortText/Filter";
import BasicContextMenuActions from "@src/components/fields/_BasicCell/BasicCellContextMenuActions";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Email" */)
);

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ShortText" */)
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
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
};
export default config;
