import React, { lazy, Suspense } from "react";
import { FieldType } from "constants/fields";
import { Editors } from "react-data-grid-addons";
import _uniq from "lodash/uniq";

import ErrorBoundary from "components/ErrorBoundary";

import NullEditor from "./editors/NullEditor";
import SideDrawerEditor from "./editors/SideDrawerEditor";
import TextEditor from "./editors/TextEditor";

const { AutoComplete } = Editors;

const MultiSelect = lazy(() => import("../Fields/MultiSelect"));
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
const SubTable = lazy(() => import("./formatters/SubTable"));

export const editable = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.rating:
    case FieldType.number:
    case FieldType.checkbox:
    case FieldType.multiSelect:
    case FieldType.image:
    case FieldType.file:
    case FieldType.longText:
    case FieldType.richText:
    case FieldType.connectTable:
    case FieldType.subTable:
    case FieldType.color:
    case FieldType.action:
    case FieldType.last:
    case FieldType.json:
      return false;
    default:
      return true;
  }
};

export const onSubmit = (key: string, row: any, uid?: string) => async (
  value: any
) => {
  // const collection = row.ref.parent.path;
  // const data = { collection, id: row.ref.id, doc: { [key]: value } };
  // if (value !== null || value !== undefined) {
  //   const _ft_updatedAt = new Date();
  //   const _ft_updatedBy = uid ?? "";
  //   row.ref.update({
  //     [key]: value,
  //     _ft_updatedAt,
  //     updatedAt: _ft_updatedAt,
  //     // _ft_updatedBy,
  //     // updatedBy: _ft_updatedBy,
  //   });
  // }
};

export const onCellSelected = (args: any) => {};

const CellWrapper: React.FC = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<div />}>{children}</Suspense>
  </ErrorBoundary>
);

export const cellFormatter = (column: any) => {
  const { type, key, options } = column;

  switch (type) {
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

    case FieldType.multiSelect:
      return (props: any) => (
        <CellWrapper>
          <MultiSelect
            {...props}
            value={props.row[key]}
            onSubmit={onSubmit(key, props.row)}
            options={options}
          />
        </CellWrapper>
      );

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

    case FieldType.subTable:
      return SubTable;

    case FieldType.shortText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.number:
      return null;

    default:
      return () => <div>CELL</div>;
  }
};

export const singleSelectEditor = (options: string[]) => {
  if (options) {
    const _options = options.map(option => ({
      id: option,
      value: option,
      title: option,
      text: option,
    }));
    // return <AutoComplete options={_options} />;
  }

  return <AutoComplete options={[]} />;
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
