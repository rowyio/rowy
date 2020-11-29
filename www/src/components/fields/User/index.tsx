import React, { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withCustomCell from "components/Table/withCustomCell";

import UserIcon from "@material-ui/icons/Person";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-User" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-User" */)
);

export const config: IFieldConfig = {
  type: FieldType.user,
  name: "User",
  dataType:
    "{ displayName: string, email: string, emailVerified: boolean, isAnonymous: boolean, photoURL: string, timestamp: firebase.firestore.Timestamp, uid: string }",
  initialValue: null,
  icon: <UserIcon />,
  description: "Displays the _ft_updatedBy field for editing history.",
  TableCell: withCustomCell(TableCell, BasicCell),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;
