import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import RichTextIcon from "@material-ui/icons/TextFormat";
import BasicCell from "../_BasicCell/BasicCellNull";
import withSideDrawerEditor from "components/Table/editors/withSideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-RichText" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-RichText" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.richText,
  name: "Rich Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <RichTextIcon />,
  description: "Rich text editor with predefined HTML text styles.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
};
export default config;
