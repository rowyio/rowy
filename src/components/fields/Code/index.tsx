import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import CodeIcon from "@mui/icons-material/Code";
import DisplayCell from "./DisplayCell";

import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Code" */)
);

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Code" */)
);

export const config: IFieldConfig = {
  type: FieldType.code,
  name: "Code",
  group: "Code",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <CodeIcon />,
  description: "Raw code edited with the Monaco Editor.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: {
      anchorOrigin: { vertical: "top", horizontal: "center" },
      PaperProps: { sx: { borderRadius: 1 } },
    },
  }),
  SideDrawerField,
  settings: Settings,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
