import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import ShortTextIcon from "@material-ui/icons/ShortText";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-ShortText" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-ShortText" */)
);

export const config: IFieldConfig = {
  type: FieldType.shortText,
  name: "Short Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <ShortTextIcon />,
  description: "Small amount of text, such as names and taglines.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
  settings: Settings,
};
export default config;
