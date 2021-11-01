import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withPopoverCell from "../_withTableCell/withPopoverCell";

import ConnectServiceIcon from "@mui/icons-material/Http";
import BasicCell from "../_BasicCell/BasicCellNull";
import InlineCell from "./InlineCell";
import NullEditor from "@src/components/Table/editors/NullEditor";

const PopoverCell = lazy(
  () =>
    import("./PopoverCell" /* webpackChunkName: "PopoverCell-ConnectService" */)
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
  TableCell: withPopoverCell(BasicCell, InlineCell, PopoverCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor as any,
  SideDrawerField,
  requireConfiguration: true,
  settings: Settings,
};
export default config;
