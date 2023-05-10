import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import GeoPointIcon from "@mui/icons-material/PinDropOutlined";
import DisplayCell from "./DisplayCell";
import BasicContextMenuActions from "@src/components/Table/ContextMenu/BasicCellContextMenuActions";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-GeoPoint" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.geoPoint,
  name: "GeoPoint",
  group: "Numeric",
  dataType: "{latitude:number; longitude:number}",
  initialValue: {},
  icon: <GeoPointIcon />,
  description: "Geo point is represented as latitude/longitude pair.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1, pt: 0 } } },
  }),
  SideDrawerField,
  contextMenuActions: BasicContextMenuActions,
};
export default config;
