import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";

import ImageIcon from "@material-ui/icons/PhotoSizeSelectActual";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Image" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Image" */)
);

export const config: IFieldConfig = {
  type: FieldType.image,
  name: "Image",
  dataType:
    "{ downloadURL: string, lastModifiedTS: number, name: string, type, ref }[]",
  initialValue: [],
  icon: <ImageIcon />,
  description:
    "Image file uploaded to Firebase Storage. Supports JPEG, PNG, SVG, GIF, WebP.",
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor,
  SideDrawerField,
};
export default config;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/gif",
  "image/webp",
];
