import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import LongTextIcon from "@mui/icons-material/Notes";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";

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
  TableCell: withTableCell(DisplayCell, EditorCell),
  SideDrawerField,
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
};
export default config;
