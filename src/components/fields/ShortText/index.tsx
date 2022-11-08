import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import ShortTextIcon from "@mui/icons-material/ShortText";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellValue";
import EditorCell from "./EditorCell";

import { filterOperators } from "./Filter";
import BasicContextMenuActions from "@src/components/fields/_BasicCell/BasicCellContextMenuActions";

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
  TableCell: withTableCell(BasicCell, EditorCell),
  SideDrawerField,
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
};
export default config;
