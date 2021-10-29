import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import FileIcon from "@mui/icons-material/AttachFile";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "@src/components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-File" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-File" */)
);

export const config: IFieldConfig = {
  type: FieldType.file,
  name: "File",
  group: "File",
  dataType:
    "{ downloadURL: string; lastModifiedTS: number; name: string; type: string; ref: string; }[]",
  initialValue: [],
  icon: <FileIcon />,
  description: "File uploaded to Firebase Storage. Supports any file type.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
};
export default config;

export { FileIcon };
