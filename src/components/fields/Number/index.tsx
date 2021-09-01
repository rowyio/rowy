import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import NumberIcon from "assets/icons/Number";
import BasicCell from "./BasicCell";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Number" */)
);

export const config: IFieldConfig = {
  type: FieldType.number,
  name: "Number",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <NumberIcon />,
  description: "Numeric data.",
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
