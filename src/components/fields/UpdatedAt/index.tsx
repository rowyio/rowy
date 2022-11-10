import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import { UpdatedAt as UpdatedAtIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-UpdatedAt" */
    )
);
const Settings = lazy(
  () =>
    import("../CreatedBy/Settings" /* webpackChunkName: "Settings-CreatedBy" */)
);

export const config: IFieldConfig = {
  type: FieldType.updatedAt,
  name: "Updated At",
  group: "Auditing",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  icon: <UpdatedAtIcon />,
  description:
    "Displays the timestamp of the last update to the row. Read-only.",
  TableCell: withTableCell(DisplayCell, null),
  SideDrawerField,
  settings: Settings,
};
export default config;
