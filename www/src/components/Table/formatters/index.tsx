import React, { lazy } from "react";
import { FieldType } from "constants/fields";

const MultiSelect = lazy(() => import("./MultiSelect"));
const DatePicker = lazy(() => import("./Date"));
const Rating = lazy(() => import("./Rating"));
const Checkbox = lazy(() => import("./Checkbox"));
const Url = lazy(() => import("./Url"));
const Image = lazy(() => import("./Image"));
const File = lazy(() => import("./File"));
const LongText = lazy(() => import("./LongText"));
const Json = lazy(() => import("./Json"));
const RichText = lazy(() => import("./RichText"));
const Color = lazy(() => import("./Color"));
const Action = lazy(() => import("./Action"));
const ConnectTable = lazy(() => import("./ConnectTable"));
const SubTable = lazy(() => import("./SubTable"));

/**
 * Gets the corresponding formatter for each cell.
 * Cells can be edited:
 * - by displaying the default react-data-grid text editor,
 * - without double-clicking, or
 * - must be edited in the side drawer.
 *
 * This is implemented alongside the correct editor — see below.
 *
 * @param column Must have column `type`
 */
export const getFormatter = (column: any) => {
  switch (column.type) {
    case FieldType.date:
    case FieldType.dateTime:
      return DatePicker;

    case FieldType.rating:
      return Rating;

    case FieldType.color:
      return Color;

    case FieldType.checkbox:
      return Checkbox;

    case FieldType.url:
      return Url;

    case FieldType.action:
      return Action;

    case FieldType.singleSelect:
    case FieldType.multiSelect:
      return MultiSelect;

    case FieldType.image:
      return Image;

    case FieldType.file:
      return File;

    case FieldType.longText:
      return LongText;

    case FieldType.json:
      return Json;

    case FieldType.richText:
      return RichText;

    case FieldType.connectTable:
      return ConnectTable;

    case FieldType.subTable:
      return SubTable;

    case FieldType.shortText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.number:
      return null;

    default:
      return () => <div />;
  }
};
