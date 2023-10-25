import { lazy } from "react";
import DataArrayIcon from "@mui/icons-material/DataArray";

import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import DisplayCell from "./DisplayCell";
import { operators } from "./Filter";

import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Array" */)
);

export const config: IFieldConfig = {
  type: FieldType.array,
  name: "Array",
  group: "Code",
  dataType: "object",
  initialValue: [],
  initializable: true,
  icon: <DataArrayIcon />,
  description:
    "Connects to a sub-table in the current row. Also displays number of rows inside the sub-table. Max sub-table depth: 100.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1, minWidth: "200px" } } },
  }),
  SideDrawerField,
  filter: { operators, defaultValue: [] },
  requireConfiguration: false,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
