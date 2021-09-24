import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import RatingIcon from "@mui/icons-material/StarBorder";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Rating" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Rating" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Rating" */)
);

export const config: IFieldConfig = {
  type: FieldType.rating,
  name: "Rating",
  group: "Numeric",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <RatingIcon />,
  description:
    "Rating displayed as stars from 0 to configurable number of stars. Default: 5 stars.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  settings: Settings,
  SideDrawerField,
};
export default config;
