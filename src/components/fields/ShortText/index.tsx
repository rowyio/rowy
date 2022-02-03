import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import ShortTextIcon from "@mui/icons-material/ShortText";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "@src/components/Table/editors/TextEditor";

import { filterOperators } from "./Filter";
import BasicContextMenuActions from "../_BasicCell/BasicCellContextMenuActions";
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-ShortText" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ShortText" */)
);

export const config: IFieldConfig = {
  type: FieldType.shortText,
  name: "Short Text",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <ShortTextIcon />,
  description: "Text displayed on a single line.",
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
