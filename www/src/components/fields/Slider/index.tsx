import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import SliderIcon from "assets/icons/Slider";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Slider" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Slider" */)
);
const Settings = lazy(
  () =>
    import("./Settings" /* webpackChunkName: "Settings-Slider" */)
);
export const config: IFieldConfig = {
  type: FieldType.slider,
  name: "Slider",
  dataType: "number",
  initialValue: undefined,
  icon: <SliderIcon />,
  description: "Slider with adjustable range. Returns a numeric value.",
  TableCell: withCustomCell(TableCell,()=> <></>),
  TableEditor: NullEditor,
  settings:Settings,
  SideDrawerField,
};
export default config;
