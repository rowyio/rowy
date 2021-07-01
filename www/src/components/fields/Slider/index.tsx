import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import SliderIcon from "assets/icons/Slider";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "components/Table/editors/withSideDrawerEditor";

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
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <SliderIcon />,
  description: "Slider with adjustable range. Returns a numeric value.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  settings: Settings,
  SideDrawerField,
};
export default config;
