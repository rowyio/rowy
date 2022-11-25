import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import DurationIcon from "@mui/icons-material/TimerOutlined";
import DisplayCell from "./DisplayCell";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Duration" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.duration,
  name: "Duration",
  group: "Date & Time",
  dataType: "Record<'start' | 'end', firebase.firestore.Timestamp>",
  initialValue: {},
  icon: <DurationIcon />,
  description: "Duration calculated from two timestamps.",
  TableCell: withRenderTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1 } } },
  }),
  SideDrawerField,
};
export default config;
