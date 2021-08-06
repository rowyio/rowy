import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import PercentageIcon from "assets/icons/Percentage";
import BasicCell from "./BasicCell";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Percentage" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.percentage,
  name: "Percentage",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <PercentageIcon />,
  description: "Percentage stored as a number between 0 and 1.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
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
