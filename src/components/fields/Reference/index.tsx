import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";

import { Reference } from "@src/assets/icons";
//import InlineCell from "./InlineCell";
import BasicCell from "./BasicCell";
import { filterOperators } from "@src/components/fields/ShortText/Filter";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-Reference" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Reference" */
    )
);
// const Settings = lazy(
//   () => import("./Settings" /* webpackChunkName: "Settings-Reference" */)
// );

export const config: IFieldConfig = {
  type: FieldType.reference,
  name: "Reference",
  group: "Connection",
  dataType: "reference",
  initialValue: null,
  initializable: true,
  icon: <Reference />,
  description: "Firestore document reference",
  TableCell: withBasicCell(BasicCell),
  TableEditor: EditorCell,
  SideDrawerField,
  //settings: Settings,
  filter: { operators: filterOperators },
  requireConfiguration: true,
};
export default config;
