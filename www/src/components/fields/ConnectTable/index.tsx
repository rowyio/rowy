import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withPopoverCell from "components/Table/withPopoverCell";

import ConnectTableIcon from "assets/icons/ConnectTable";
import PopoverBasicCell from "./PopoverBasicCell";
import NullEditor from "components/Table/editors/NullEditor";

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

export const config: IFieldConfig = {
  type: FieldType.connectTable,
  name: "Connect Table",
  dataType: "{ docPath: string; snapshot: Record<string, any>; }",
  initialValue: [],
  icon: <ConnectTableIcon />,
  description:
    "Connects to an existing table to fetch a snapshot of values from a row. Requires Algolia integration.",
  TableCell: withPopoverCell(PopoverCell, PopoverBasicCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
