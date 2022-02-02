import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import RichTextIcon from "@mui/icons-material/TextFormat";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";
import BasicContextMenuActions from "../_BasicCell/BasicCellContextMenuActions";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-RichText" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-RichText" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.richText,
  name: "Rich Text",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <RichTextIcon />,
  description: "HTML edited with a rich text editor.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
};
export default config;
