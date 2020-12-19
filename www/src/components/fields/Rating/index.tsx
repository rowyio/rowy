import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import RatingIcon from "@material-ui/icons/StarBorder";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Rating" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Rating" */)
);
const Settings = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "Settings-Rating" */)
);
export const config: IFieldConfig = {
  type: FieldType.rating,
  name: "Rating",
  dataType: "number",
  initialValue: undefined,
  icon: <RatingIcon />,
  description: "Rating displayed as stars from 0 to configurable number of stars. Default: 5 stars.",
  TableCell: withCustomCell(TableCell,()=> <></>),
  TableEditor: NullEditor,
  settings:Settings,
  SideDrawerField,
};
export default config;
