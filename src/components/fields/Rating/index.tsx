import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "@src/components/fields/_withTableCell/withHeavyCell";

import RatingIcon from "@mui/icons-material/StarBorder";
import BasicCell from "@src/components/fields/_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";
import { filterOperators } from "@src/components/fields/Number/Filter";

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
  requireConfiguration: true,
  description:
    "Rating displayed as stars. Max stars is configurable, default: 5 stars.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  settings: Settings,
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
  csvImportParser: (value: string) => {
    try {
      const parsed = parseInt(value);
      if (isNaN(parsed)) {
        throw new Error("Invalid rating value!");
      }
      return parsed;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
export default config;
