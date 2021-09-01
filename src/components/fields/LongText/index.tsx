import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import LongTextIcon from "@material-ui/icons/Notes";
import BasicCell from "./BasicCell";
import withSideDrawerEditor from "components/Table/editors/withSideDrawerEditor";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-LongText" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.longText,
  name: "Long Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <LongTextIcon />,
  description: "Large amount of text, such as sentences and paragraphs.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: withSideDrawerEditor(BasicCell),
  SideDrawerField,
};
export default config;
