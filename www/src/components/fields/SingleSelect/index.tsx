import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withPopoverCell from "../_withTableCell/withPopoverCell";

import SingleSelectIcon from "@material-ui/icons/FormatListBulleted";
import BasicCell from "../_BasicCell/BasicCellNull";
import InlineCell from "./InlineCell";
import NullEditor from "components/Table/editors/NullEditor";

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
  dataType: "string | null",
  initialValue: null,
  initializable: true,
  icon: <SingleSelectIcon />,
  description:
    "Dropdown selector with searchable options and radio button behavior. Optionally allows users to input custom values. Max selection: 1 option.",
  TableCell: withPopoverCell(BasicCell, InlineCell, PopoverCell, {
    anchorOrigin: { horizontal: "left", vertical: "bottom" },
    transparent: true,
  }),
  TableEditor: NullEditor,
  SideDrawerField,
  settings: Settings,
  requireConfiguration: true,
};
export default config;
