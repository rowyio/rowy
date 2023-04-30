import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { SingleSelect as SingleSelectIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";
import { filterOperators } from "@src/components/fields/ShortText/Filter";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-SingleSelect" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-SingleSelect" */)
);

export const config: IFieldConfig = {
  type: FieldType.singleSelect,
  name: "Single Select",
  group: "Select",
  dataType: "string",
  initialValue: null,
  initializable: true,
  icon: <SingleSelectIcon />,
  description:
    "Single value from predefined options. Options are searchable and users can optionally input custom values.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
    transparentPopover: true,
  }),
  SideDrawerField,
  settings: Settings,
  filter: { operators: filterOperators },
  requireConfiguration: true,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
