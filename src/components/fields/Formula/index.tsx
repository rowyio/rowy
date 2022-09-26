import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import { Derivative as DerivativeIcon } from "@src/assets/icons";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";
import Settings, { settingsValidator } from "./Settings";
import withHeavyCell from "@src/components/fields/_withTableCell/withHeavyCell";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Formula" */)
);

export const config: IFieldConfig = {
  type: FieldType.formula,
  name: "Formula",
  group: "Client Function",
  dataType: "any",
  initialValue: undefined,
  icon: <DerivativeIcon />,
  description: "Client Function (Alpha)",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField: BasicCell as any,
  settings: Settings,
  settingsValidator: settingsValidator,
  requireConfiguration: true,
};
export default config;
