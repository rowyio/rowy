import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withPopoverCell from "../_withTableCell/withPopoverCell";
import ConnectorIcon from "@mui/icons-material/Cable";
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
  type: FieldType.connector,
  name: "Connector",
  group: "Connection",
  dataType: "any",
  initialValue: "",
  initializable: true,
  icon: <ConnectorIcon />,
  description:
    "Connects to any table or API to fetch a list of results based on a text query or row data.",
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
