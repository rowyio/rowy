import React, { lazy, Suspense } from "react";
import { FieldType } from "../Fields";
import { Editors } from "react-data-grid-addons";
import MultiSelect from "../Fields/MultiSelect";

import { algoliaUpdateDoc } from "../../firebase/callables";

const { AutoComplete } = Editors;
const Date = lazy(() => import("../Fields/Date"));
const Rating = lazy(() => import("../Fields/Rating"));
const CheckBox = lazy(() => import("../Fields/CheckBox"));
const UrlLink = lazy(() => import("../Fields/UrlLink"));
const Image = lazy(() => import("../Fields/Image"));
const File = lazy(() => import("../Fields/File"));
const LongText = lazy(() => import("../Fields/LongText"));
const Color = lazy(() => import("../Fields/Color"));
const Action = lazy(() => import("../Fields/Action"));

export const editable = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.rating:
    case FieldType.checkBox:
    case FieldType.multiSelect:
    case FieldType.image:
    case FieldType.file:
    case FieldType.longText:
    case FieldType.documentSelect:
    case FieldType.color:
    case FieldType.action:
    case FieldType.last:
      return false;
    default:
      return true;
  }
};
export const onSubmit = (key: string, row: any) => async (value: any) => {
  const collection = row.ref.parent.path;
  const data = { collection, id: row.ref.id, doc: { [key]: value } };
  if (value !== null || value !== undefined) {
    row.ref.update({ [key]: value });
    await algoliaUpdateDoc(data);
  }
};

export const DateFormatter = (key: string, fieldType: FieldType) => (
  props: any
) => {
  return (
    <Date
      {...props}
      onSubmit={onSubmit(key, props.row)}
      fieldType={fieldType}
    />
  );
};

export const onGridRowsUpdated = (event: any) => {
  const { fromRowData, updated } = event;

  onSubmit(Object.keys(updated)[0], fromRowData)(Object.values(updated)[0]);
};
export const onCellSelected = (args: any) => {};
export const cellFormatter = (column: any) => {
  const { type, key, options } = column;
  switch (type) {
    case FieldType.date:
    case FieldType.dateTime:
      return DateFormatter(key, type);
    case FieldType.rating:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <Rating
              {...props}
              onSubmit={onSubmit(key, props.row)}
              value={typeof props.value === "number" ? props.value : 0}
            />
          </Suspense>
        );
      };
    case FieldType.color:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <Color {...props} onSubmit={onSubmit(key, props.row)} />
          </Suspense>
        );
      };
    case FieldType.checkBox:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <CheckBox {...props} onSubmit={onSubmit(key, props.row)} />
          </Suspense>
        );
      };
    case FieldType.url:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <UrlLink {...props} />
          </Suspense>
        );
      };
    case FieldType.action:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <Action {...props} onSubmit={onSubmit(key, props.row)} />
          </Suspense>
        );
      };
    case FieldType.multiSelect:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <MultiSelect
              {...props}
              onSubmit={onSubmit(key, props.row)}
              options={options}
            />
          </Suspense>
        );
      };
    case FieldType.image:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <Image
              {...props}
              onSubmit={onSubmit(key, props.row)}
              fieldName={key}
            />
          </Suspense>
        );
      };
    case FieldType.file:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <File
              {...props}
              onSubmit={onSubmit(key, props.row)}
              fieldName={key}
            />
          </Suspense>
        );
      };
    case FieldType.longText:
      return (props: any) => {
        return (
          <Suspense fallback={<div />}>
            <LongText {...props} onSubmit={onSubmit(key, props.row)} />
          </Suspense>
        );
      };

    default:
      return false;
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
    return <AutoComplete options={_options} />;
  }

  return <AutoComplete options={[]} />;
};
