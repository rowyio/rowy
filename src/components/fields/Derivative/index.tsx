import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import DerivativeIcon from "assets/icons/Derivative";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";
import Settings from "./Settings";

export const config: IFieldConfig = {
  type: FieldType.derivative,
  name: "Derivative",
  group: "Cloud Function",
  dataType: "any",
  initialValue: "",
  initializable: true,
  icon: <DerivativeIcon />,
  requireConfiguration: true,
  description:
    "Value derived from the rest of the row’s values. Displayed using any other field type. Requires Cloud Function set up.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: NullEditor as any,
  SideDrawerField: BasicCell as any,
  settings: Settings,
};
export default config;
