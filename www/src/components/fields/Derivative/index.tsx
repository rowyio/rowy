import React from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import DerivativeIcon from "assets/icons/Derivative";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";
import Settings from './Settings'
export const config: IFieldConfig = {
  type: FieldType.derivative,
  name: "Derivative",
  dataType: "string",
  initialValue:undefined,
  initializable: true,
  icon: <DerivativeIcon />,
  description: "Value derived from the rest of the row’s values. Displayed using any other field type. Requires Cloud Function setup.",
  TableCell: withCustomCell(BasicCell as any, BasicCell),
  TableEditor: NullEditor,
  SideDrawerField: BasicCell as any,
  settings:Settings

};
export default config;
