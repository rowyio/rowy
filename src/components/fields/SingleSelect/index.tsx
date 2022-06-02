import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withPopoverCell from "@src/components/fields/_withTableCell/withPopoverCell";

import { SingleSelect as SingleSelectIcon } from "@src/assets/icons";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellNull";
import InlineCell from "./InlineCell";
import NullEditor from "@src/components/Table/editors/NullEditor";
import { filterOperators } from "@src/components/fields/ShortText/Filter";

const PopoverCell = lazy(
  () =>
    import("./PopoverCell" /* webpackChunkName: "PopoverCell-SingleSelect" */)
);
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
  dataType: "string | null",
  initialValue: null,
  initializable: true,
  icon: <SingleSelectIcon />,
  description:
    "Single value from predefined options. Options are searchable and users can optionally input custom values.",
  TableCell: withPopoverCell(BasicCell, InlineCell, PopoverCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor as any,
  SideDrawerField,
  settings: Settings,
  filter: { operators: filterOperators },
  requireConfiguration: true,
};
export default config;
