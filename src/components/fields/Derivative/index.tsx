import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

import { Derivative as DerivativeIcon } from "@src/assets/icons";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";
import Settings, { settingsValidator } from "./Settings";
// import ContextMenuActions from "./ContextMenuActions";

export const config: IFieldConfig = {
  type: FieldType.derivative,
  name: "Derivative",
  group: "Cloud Function",
  dataType: "any",
  initialValue: "",
  initializable: true,
  icon: <DerivativeIcon />,
  description:
    "Value derived from the rest of the row’s values. Displayed using any other field type. Requires Rowy Run set up.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: NullEditor as any,
  SideDrawerField: BasicCell as any,
  // FIXME: contextMenuActions: ContextMenuActions,
  settings: Settings,
  settingsValidator,
  requireConfiguration: true,
};
export default config;
