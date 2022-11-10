import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import { MultiSelect as MultiSelectIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";
import { filterOperators } from "./Filter";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-MultiSelect" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-MultiSelect" */
    )
);
const Settings = lazy(
  () =>
    import(
      "../SingleSelect/Settings" /* webpackChunkName: "Settings-SingleSelect" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.multiSelect,
  name: "Multi Select",
  group: "Select",
  dataType: "string[]",
  initialValue: [],
  initializable: true,
  icon: <MultiSelectIcon />,
  description:
    "Multiple values from predefined options. Options are searchable and users can optionally input custom values.",
  TableCell: withTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
    transparentPopover: true,
  }),
  SideDrawerField,
  settings: Settings,
  csvImportParser: (v) => {
    if (v.includes(",")) {
      return v.split(",").map((i) => i.trim());
    } else if (v !== "") return [v];
    else return v;
  },
  requireConfiguration: true,
  filter: {
    operators: filterOperators,
  },
};
export default config;
