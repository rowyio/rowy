import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import StatusIcon from "@src/assets/icons/Status";
import NullEditor from "@src/components/Table/editors/NullEditor";

import { filterOperators } from "./Filter";
import BasicCell from "../_BasicCell/BasicCellNull";
import PopoverCell from "./PopoverCell";
import InlineCell from "./InlineCell";
import withPopoverCell from "../_withTableCell/withPopoverCell";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Status" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Status" */)
);

export const config: IFieldConfig = {
  type: FieldType.status,
  name: "Status",
  group: "Cloud Function",
  dataType: "any",
  initialValue: undefined,
  initializable: true,
  icon: <StatusIcon />,
  description: "Displays field value as custom status text. Read-only.	",
  TableCell: withPopoverCell(BasicCell, InlineCell, PopoverCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor as any,
  settings: Settings,
  SideDrawerField,
  requireConfiguration: true,
  filter: {
    operators: filterOperators,
  },
};
export default config;
