import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import { Image as ImageIcon } from "@src/assets/icons";
import DisplayCell from "./DisplayCell";
import ContextMenuActions from "./ContextMenuActions";

const EditorCell = lazy(
  () => import("./EditorCell" /* webpackChunkName: "EditorCell-Image" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Image" */)
);

export const config: IFieldConfig = {
  type: FieldType.image,
  name: "Image",
  group: "File",
  dataType: "RowyFile[]",
  initialValue: [],
  icon: <ImageIcon />,
  description:
    "Image file uploaded to Firebase Storage. Supports JPEG, PNG, SVG, GIF, WebP, AVIF, JPEG XL.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "inline", {
    disablePadding: true,
  }),
  SideDrawerField,
  contextMenuActions: ContextMenuActions,
};
export default config;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/jxl",
];
