import React, { lazy } from "react";
import { FieldType } from "constants/fields";

import withCustomCell from "./withCustomCell";

const MultiSelect = lazy(() =>
  import("./MultiSelect" /* webpackChunkName: "MultiSelect" */)
);
const DatePicker = lazy(() => import("./Date" /* webpackChunkName: "Date" */));
const Rating = lazy(() => import("./Rating" /* webpackChunkName: "Rating" */));
const Checkbox = lazy(() =>
  import("./Checkbox" /* webpackChunkName: "Checkbox" */)
);
const Url = lazy(() => import("./Url" /* webpackChunkName: "Url" */));
const Image = lazy(() => import("./Image" /* webpackChunkName: "Image" */));
const File = lazy(() => import("./File" /* webpackChunkName: "File" */));
const LongText = lazy(() =>
  import("./LongText" /* webpackChunkName: "LongText" */)
);
const Json = lazy(() => import("./Json" /* webpackChunkName: "Json" */));
const User = lazy(() => import("./User" /* webpackChunkName: "User" */));
const Code = lazy(() => import("./Code" /* webpackChunkName: "Code" */));
const RichText = lazy(() =>
  import("./RichText" /* webpackChunkName: "RichText" */)
);
const Color = lazy(() => import("./Color" /* webpackChunkName: "Color" */));
const Action = lazy(() => import("./Action" /* webpackChunkName: "Action" */));
const ConnectTable = lazy(() =>
  import("./ConnectTable" /* webpackChunkName: "ConnectTable" */)
);
const SubTable = lazy(() =>
  import("./SubTable" /* webpackChunkName: "SubTable" */)
);
const Percentage = lazy(() =>
  import("./Percentage" /* webpackChunkName: "Percentage" */)
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
 */
export const getFormatter = (column: any) => {
  switch (column.type) {
    case FieldType.date:
    case FieldType.dateTime:
      return withCustomCell(DatePicker);

    case FieldType.rating:
      return withCustomCell(Rating);
    case FieldType.percentage:
      return withCustomCell(Percentage);

    case FieldType.color:
      return withCustomCell(Color);

    case FieldType.checkbox:
      return withCustomCell(Checkbox);

    case FieldType.url:
      return withCustomCell(Url);

    case FieldType.action:
      return withCustomCell(Action);

    case FieldType.singleSelect:
    case FieldType.multiSelect:
      return withCustomCell(MultiSelect);

    case FieldType.image:
      return withCustomCell(Image);

    case FieldType.file:
      return withCustomCell(File);

    case FieldType.longText:
      return withCustomCell(LongText);

    case FieldType.json:
      return withCustomCell(Json);

    case FieldType.user:
      return withCustomCell(User);
    case FieldType.code:
      return withCustomCell(Code);
    case FieldType.richText:
      return withCustomCell(RichText);

    case FieldType.connectTable:
      return withCustomCell(ConnectTable);

    case FieldType.subTable:
      return withCustomCell(SubTable);

    case FieldType.shortText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.number:
    case FieldType.slider:
      return undefined;

    default:
      return () => <div />;
  }
};
