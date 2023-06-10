import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import RatingIcon from "@mui/icons-material/StarBorder";
import DisplayCell from "./DisplayCell";
import EditorCell from "./EditorCell";
import { filterOperators } from "@src/components/fields/Number/Filter";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

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
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "inline"),
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
  contextMenuActions: BasicContextMenuActions,
};
export default config;
