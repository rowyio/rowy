import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "@src/components/fields/_withTableCell/withHeavyCell";

import { Slider as SliderIcon } from "@src/assets/icons";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellNull";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";
import { filterOperators } from "@src/components/fields/Number/Filter";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Slider" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Slider" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Slider" */)
);

export const config: IFieldConfig = {
  type: FieldType.slider,
  name: "Slider",
  group: "Numeric",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <SliderIcon />,
  requireConfiguration: true,
  description: "Numeric value edited with a Slider. Range is configurable.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
  SideDrawerField,
  csvImportParser: (value: string) => {
    try {
      const parsed = parseInt(value);
      if (isNaN(parsed)) {
        throw new Error("Invalid slider value!");
      }
      return parsed;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
export default config;
