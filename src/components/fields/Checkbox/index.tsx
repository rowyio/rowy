import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import CheckboxIcon from "@mui/icons-material/ToggleOnOutlined";
import DisplayCell from "./DisplayCell";

import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-Checkbox" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Checkbox" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.checkbox,
  name: "Toggle",
  group: "Numeric",
  dataType: "boolean",
  initialValue: false,
  initializable: true,
  icon: <CheckboxIcon />,
  description: "True/false value. Default: false.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "inline", {
    usesRowData: true,
  }),
  csvImportParser: (value: string) => {
    if (["YES", "TRUE", "1"].includes(value.toUpperCase())) return true;
    else if (["NO", "FALSE", "0"].includes(value.toUpperCase())) return false;
    else return null;
  },
  filter: {
    operators: [
      {
        value: "==",
        label: "is",
      },
    ],
    defaultValue: false,
  },
  SideDrawerField,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
