import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import FileIcon from "@mui/icons-material/AttachFile";
import DisplayCell from "./DisplayCell";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-File" */)
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
  TableCell: withTableCell(DisplayCell, EditorCell, "inline", {
    disablePadding: true,
  }),
  SideDrawerField,
};
export default config;

export { FileIcon };
