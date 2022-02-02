import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import NumberIcon from "@src/assets/icons/Number";
import BasicCell from "./BasicCell";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "./Filter";
import BasicContextMenuActions from "../_BasicCell/BasicCellContextMenuActions";
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Number" */)
);

export const config: IFieldConfig = {
  type: FieldType.number,
  name: "Number",
  group: "Numeric",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <NumberIcon />,
  description: "Numeric value.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
  csvImportParser: (v) => {
    try {
      const parsedValue = parseFloat(v);
      return Number.isNaN(parsedValue) ? null : parsedValue;
    } catch (e) {
      return null;
    }
  },
};
export default config;
