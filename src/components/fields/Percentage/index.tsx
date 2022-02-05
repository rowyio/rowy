import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import PercentageIcon from "@src/assets/icons/Percentage";
import BasicCell from "./BasicCell";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "../Number/Filter";
import BasicContextMenuActions from "../_BasicCell/BasicCellContextMenuActions";
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Percentage" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.percentage,
  name: "Percentage",
  group: "Numeric",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <PercentageIcon />,
  description: "Percentage stored as a number between 0 and 1.",
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
