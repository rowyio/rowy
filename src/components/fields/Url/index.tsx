import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import UrlIcon from "@mui/icons-material/Link";
import BasicCell from "../_BasicCell/BasicCellValue";
import TextEditor from "components/Table/editors/TextEditor";

const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Url" */)
);

export const config: IFieldConfig = {
  type: FieldType.url,
  name: "URL",
  group: "Text",
  dataType: "string",
  initialValue: "",
  initializable: true,
  icon: <UrlIcon />,
  description: "Web address.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: TextEditor,
  SideDrawerField,
};
export default config;
