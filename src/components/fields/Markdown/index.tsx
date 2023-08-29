import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Markdown as MarkdownIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-markdown" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.markdown,
  name: "Markdown",
  group: "Code",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <MarkdownIcon />,
  description: "Markdown editor with preview",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover"),
  SideDrawerField,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
