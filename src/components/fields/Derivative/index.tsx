import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import DerivativeIcon from "@src/assets/icons/Derivative";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";
import Settings, { settingsValidator } from "./Settings";
import ContextMenuActions from "./ContextMenuActions";
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
  contextMenuActions: ContextMenuActions,
  settings: Settings,
  settingsValidator,
  requireConfiguration: true,
};
export default config;
