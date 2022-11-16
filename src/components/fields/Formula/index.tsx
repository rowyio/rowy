import { Derivative as DerivativeIcon } from "@src/assets/icons";

import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import Settings, { settingsValidator } from "./Settings";
import DisplayCell from "./DisplayCell";

export const config: IFieldConfig = {
  type: FieldType.formula,
  name: "Formula",
  group: "Client Function",
  dataType: "any",
  initialValue: "",
  icon: <DerivativeIcon />,
  description: "Client Function (Alpha)",
  TableCell: withTableCell(DisplayCell, DisplayCell, "inline", {
    usesRowData: true,
  }),
  SideDrawerField: () => null as any,
  settings: Settings,
  settingsValidator: settingsValidator,
  requireConfiguration: true,
};
export default config;
