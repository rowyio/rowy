import { Derivative as DerivativeIcon } from "@src/assets/icons";

import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";
import DisplayCell from "./DisplayCell";

import Settings, { settingsValidator } from "./Settings";

export const config: IFieldConfig = {
  type: FieldType.formula,
  name: "Formula",
  group: "Client Function",
  dataType: "any",
  initialValue: "",
  icon: <DerivativeIcon />,
  description: "Client Function (Alpha)",
  TableCell: withRenderTableCell(DisplayCell as any, null, undefined, {
    usesRowData: true,
  }),
  SideDrawerField: () => null as any,
  settings: Settings,
  settingsValidator: settingsValidator,
  requireConfiguration: true,
};
export default config;
