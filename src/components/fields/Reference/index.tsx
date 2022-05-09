import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import NumberIcon from "@src/assets/icons/Number";
import BasicCell from "./BasicCell";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "./Filter";
import { db } from "@src/firebase";
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Reference" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.reference,
  name: "Refrence",
  group: "Connection",
  dataType: "Reference",
  initialValue: 0,
  initializable: true,
  icon: <NumberIcon />,
  description: "Firestore Document reference",
  // contextMenuActions: BasicContextMenuActions,
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
  csvImportParser: (v) => {
    try {
      return db.doc(v);
    } catch (e) {
      return null;
    }
  },
};
export default config;
