import React, { lazy } from "react";
import { FieldType } from "constants/fields";

import withCustomCell from "./withCustomCell";

const MultiSelect = lazy(
  () => import("./MultiSelect" /* webpackChunkName: "MultiSelect" */)
);
const DatePicker = lazy(() => import("./Date" /* webpackChunkName: "Date" */));
const Duration = lazy(
  () => import("./Duration" /* webpackChunkName: "Duration" */)
);
const Rating = lazy(() => import("./Rating" /* webpackChunkName: "Rating" */));
const Checkbox = lazy(
  () => import("./Checkbox" /* webpackChunkName: "Checkbox" */)
);
const Url = lazy(() => import("./Url" /* webpackChunkName: "Url" */));
const Image = lazy(() => import("./Image" /* webpackChunkName: "Image" */));
const File = lazy(() => import("./File" /* webpackChunkName: "File" */));
const LongText = lazy(
  () => import("./LongText" /* webpackChunkName: "LongText" */)
);
const Json = lazy(() => import("./Json" /* webpackChunkName: "Json" */));
const User = lazy(() => import("./User" /* webpackChunkName: "User" */));
const Code = lazy(() => import("./Code" /* webpackChunkName: "Code" */));
const RichText = lazy(
  () => import("./RichText" /* webpackChunkName: "RichText" */)
);
const Color = lazy(() => import("./Color" /* webpackChunkName: "Color" */));
const Action = lazy(() => import("./Action" /* webpackChunkName: "Action" */));
const ConnectTable = lazy(
  () => import("./ConnectTable" /* webpackChunkName: "ConnectTable" */)
);
const ConnectService = lazy(() => import("./ConnectService"));
const SubTable = lazy(
  () => import("./SubTable" /* webpackChunkName: "SubTable" */)
);
const Percentage = lazy(
  () => import("./Percentage" /* webpackChunkName: "Percentage" */)
);

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
 * @param readOnly Prevent the formatter from updating the cell value
 */
export const getFormatter = (column: any, readOnly: boolean = false) => {
  let _type = column.type;
  if (column.config?.renderFieldType) _type = column.config.renderFieldType;

  switch (_type) {
    case FieldType.date:
    case FieldType.dateTime:
      return withCustomCell(DatePicker, readOnly);
    case FieldType.duration:
      return withCustomCell(Duration, readOnly);

    case FieldType.rating:
      return withCustomCell(Rating, readOnly);
    case FieldType.percentage:
      return withCustomCell(Percentage, readOnly);

    case FieldType.color:
      return withCustomCell(Color, readOnly);

    case FieldType.checkbox:
      return withCustomCell(Checkbox, readOnly);

    case FieldType.url:
      return withCustomCell(Url, readOnly);

    case FieldType.action:
      return withCustomCell(Action, readOnly);

    case FieldType.singleSelect:
    case FieldType.multiSelect:
      return withCustomCell(MultiSelect, readOnly);

    case FieldType.image:
      return withCustomCell(Image, readOnly);

    case FieldType.file:
      return withCustomCell(File, readOnly);

    case FieldType.longText:
      return withCustomCell(LongText, readOnly);

    case FieldType.json:
      return withCustomCell(Json, readOnly);

    case FieldType.user:
      return withCustomCell(User, readOnly);

    case FieldType.code:
      return withCustomCell(Code, readOnly);

    case FieldType.richText:
      return withCustomCell(RichText, readOnly);

    case FieldType.connectTable:
      return withCustomCell(ConnectTable, readOnly);

    case FieldType.connectService:
      return withCustomCell(ConnectService, readOnly);

    case FieldType.subTable:
      return withCustomCell(SubTable, readOnly);

    case FieldType.shortText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.number:
    case FieldType.slider:
      return undefined;

    default:
      return () => <div />;
  }
};
