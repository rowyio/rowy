import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

import LongTextIcon from "@mui/icons-material/Notes";
import BasicCell from "./BasicCell";
import TextEditor from "@src/components/Table/editors/TextEditor";

import { filterOperators } from "./Filter";
import BasicContextMenuActions from "@src/components/fields/_BasicCell/BasicCellContextMenuActions";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-LongText" */
    )
);

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-LongText" */)
);

export const config: IFieldConfig = {
  type: FieldType.longText,
  name: "Long Text",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <LongTextIcon />,
  description: "Text displayed on multiple lines.",
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
