import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withPopoverCell from "../_withTableCell/withPopoverCell";

import ConnectTableIcon from "@src/assets/icons/ConnectTable";
import BasicCell from "../_BasicCell/BasicCellNull";
import InlineCell from "./InlineCell";
import NullEditor from "@src/components/Table/editors/NullEditor";

const PopoverCell = lazy(
  () =>
    import("./PopoverCell" /* webpackChunkName: "PopoverCell-ConnectTable" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-ConnectTable" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ConnectTable" */)
);

export const config: IFieldConfig = {
  type: FieldType.connectTable,
  name: "Connect Table (Alpha)",
  group: "Connection",
  dataType:
    "{ docPath: string; snapshot: Record<string, any>; }[] | { docPath: string; snapshot: Record<string, any>; } | null",
  initialValue: [],
  icon: <ConnectTableIcon />,
  description:
    "Connects to an existing table to fetch a snapshot of values from a row. Requires Rowy Run and Algolia setup.",
  TableCell: withPopoverCell(BasicCell, InlineCell, PopoverCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor as any,
  SideDrawerField,
  settings: Settings,
  requireConfiguration: true,
};
export default config;
