import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Slider as SliderIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";
import { filterOperators } from "@src/components/fields/Number/Filter";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

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
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1, pt: 5 } } },
  }),
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
  contextMenuActions: BasicContextMenuActions,
};
export default config;
