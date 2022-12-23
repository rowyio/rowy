import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import ConnectServiceIcon from "@mui/icons-material/Http";
import DisplayCell from "./DisplayCell";

const EditorCell = lazy(
  () =>
    import("./EditorCell" /* webpackChunkName: "EditorCell-ConnectService" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-ConnectService" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ConnectService" */)
);

export const config: IFieldConfig = {
  type: FieldType.connectService,
  name: "Connect Service (Alpha)",
  group: "Connection",
  dataType: "{ docPath: string; snapshot: Record<string, any>; }[]",
  initialValue: [],
  icon: <ConnectServiceIcon />,
  description:
    "Connects to an external web service to fetch a list of results.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
    transparentPopover: true,
  }),
  SideDrawerField,
  requireConfiguration: true,
  settings: Settings,
};
export default config;
