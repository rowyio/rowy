import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withPopoverCell from "components/Table/withPopoverCell";

import ConnectServiceIcon from "@material-ui/icons/Http";
import PopoverBasicCell from "./PopoverBasicCell";
import NullEditor from "components/Table/editors/NullEditor";

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
  name: "Connect Table",
  dataType: "{ docPath: string; snapshot: Record<string, any>; }",
  initialValue: [],
  icon: <ConnectServiceIcon />,
  description:
    "Connects to an external web service to fetch a list of results.",
  TableCell: withPopoverCell(PopoverCell, PopoverBasicCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor,
  SideDrawerField,
  settings: Settings,
};
export default config;
