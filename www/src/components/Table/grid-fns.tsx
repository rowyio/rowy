import React, { lazy, Suspense } from "react";
import { FieldType } from "constants/fields";
import _uniq from "lodash/uniq";

import ErrorBoundary from "components/ErrorBoundary";

import NullEditor from "./editors/NullEditor";
import SideDrawerEditor from "./editors/SideDrawerEditor";
import TextEditor from "./editors/TextEditor";

const MultiSelect = lazy(() => import("./formatters/MultiSelect"));
const DatePicker = lazy(() => import("./formatters/Date"));
const Rating = lazy(() => import("./formatters/Rating"));
const Checkbox = lazy(() => import("./formatters/Checkbox"));
const Url = lazy(() => import("./formatters/Url"));
const Image = lazy(() => import("./formatters/Image"));
const File = lazy(() => import("./formatters/File"));
const LongText = lazy(() => import("./formatters/LongText"));
const Json = lazy(() => import("./formatters/Json"));
const RichText = lazy(() => import("./formatters/RichText"));
const Color = lazy(() => import("./formatters/Color"));
const Action = lazy(() => import("./formatters/Action"));
const ConnectTable = lazy(() => import("./formatters/ConnectTable"));
const SubTable = lazy(() => import("./formatters/SubTable"));

export const onCellSelected = (args: any) => {};

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

/**
 * Gets the corresponding editor for each cell. Either:
 * - displays the default react-data-grid text editor,
 * - can be edited without double-clicking, or
 * - must be edited in the side drawer
 * @param column Must have column `type`
 */
export const getEditor = (column: any) => {
  const { type } = column;

  switch (type) {
    // Can be edited without double-clicking
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.checkbox:
    case FieldType.rating:
    case FieldType.image:
    case FieldType.file:
    case FieldType.singleSelect:
    case FieldType.multiSelect:
    case FieldType.color:
      return NullEditor;

    // Can be edited without double-clicking; side drawer editor not implemented
    case FieldType.connectTable:
    case FieldType.subTable:
    case FieldType.action:
      return NullEditor;

    // Supports react-data-grid’s in-cell editing
    case FieldType.shortText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.number:
      return TextEditor;

    // No in-cell editing; must open side drawer
    case FieldType.longText:
    case FieldType.richText:
    case FieldType.slider:
    case FieldType.json:
    default:
      return SideDrawerEditor;
  }
};
