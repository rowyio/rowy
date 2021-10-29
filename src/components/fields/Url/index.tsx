import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import UrlIcon from "@mui/icons-material/Link";
import TableCell from "./TableCell";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "../ShortText/Filter";

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
  description: "Web address. Not validated.",
  TableCell: withBasicCell(TableCell),
  TableEditor: TextEditor,
  SideDrawerField,
  filter: {
    operators: filterOperators,
  },
};
export default config;
