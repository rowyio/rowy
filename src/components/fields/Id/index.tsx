import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import DisplayCell from "./DisplayCell";
import { Id as IdIcon } from "@src/assets/icons";

const SideDrawerField = lazy(
  () => import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Id" */)
);

export const config: IFieldConfig = {
  type: FieldType.id,
  name: "ID",
  group: "Metadata",
  dataType: "string",
  initialValue: "",
  icon: <IdIcon />,
  description: "Displays the row’s ID. Read-only. Cannot be sorted.",
  TableCell: withTableCell(DisplayCell, null),
  SideDrawerField,
};
export default config;
