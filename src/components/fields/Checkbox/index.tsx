import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import CheckboxIcon from "@mui/icons-material/ToggleOnOutlined";
import BasicCell from "../_BasicCell/BasicCellName";
import NullEditor from "@src/components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Checkbox" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Checkbox" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.checkbox,
  name: "Toggle",
  group: "Numeric",
  dataType: "boolean",
  initialValue: false,
  initializable: true,
  icon: <CheckboxIcon />,
  description: "True/false value. Default: false.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  csvImportParser: (value: string) => {
    if (["YES", "TRUE", "1"].includes(value.toUpperCase())) return true;
    else if (["NO", "FALSE", "0"].includes(value.toUpperCase())) return false;
    else return null;
  },
  filter: {
    operators: [
      {
        value: "==",
        label: "is",
      },
    ],
    defaultValue: false,
  },
  SideDrawerField,
};
export default config;
