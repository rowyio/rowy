import { lazy } from "react";
import FormulaIcon from "@mui/icons-material/Functions";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import DisplayCell from "./DisplayCell";

import Settings, { settingsValidator } from "./Settings";
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Formula" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.formula,
  name: "Formula",
  group: "Client Function",
  dataType: "any",
  initialValue: "",
  icon: <FormulaIcon />,
  description: "Client Function (Alpha)",
  TableCell: withRenderTableCell(DisplayCell as any, null, undefined, {
    usesRowData: true,
  }),
  SideDrawerField,
  settings: Settings,
  settingsValidator: settingsValidator,
  requireConfiguration: true,
};
export default config;
