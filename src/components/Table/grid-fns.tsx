import React from "react";
import { FieldType, getFieldIcon } from "../Fields";

import Date from "../Fields/Date";
import Rating from "../Fields/Rating";
import CheckBox from "../Fields/CheckBox";
import UrlLink from "../Fields/UrlLink";
import firebase from "firebase/app";
import { Editors } from "react-data-grid-addons";
export const copyPaste = (props: any) => {
  console.log(props);
};
export const editable = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.rating:
    case FieldType.checkBox:
      return false;

    default:
      return true;
  }
};
export const onSubmit = (key: string) => (
  ref: firebase.firestore.DocumentReference,
  value: any
) => {
  if (value !== null || value !== undefined) {
    ref.update({ [key]: value });
  }
};

export const DateFormatter = (key: string, fieldType: FieldType) => (
  props: any
) => {
  return <Date {...props} onSubmit={onSubmit(key)} fieldType={fieldType} />;
};

export const onGridRowsUpdated = (props: any) => {
  const { fromRowData, updated } = props;
  fromRowData.ref.update(updated);
};
export const onCellSelected = (args: any) => {
  console.log(args);
};
export const cellFormatter = (fieldType: FieldType, key: string) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
      return DateFormatter(key, fieldType);
    case FieldType.rating:
      return (props: any) => {
        return (
          <Rating
            {...props}
            onSubmit={onSubmit(key)}
            value={typeof props.value === "number" ? props.value : 0}
          />
        );
      };
    case FieldType.checkBox:
      return (props: any) => {
        return <CheckBox {...props} onSubmit={onSubmit(key)} />;
      };
    case FieldType.url:
      return (props: any) => {
        return <UrlLink {...props} onSubmit={onSubmit(key)} />;
      };
    default:
      return false;
  }
};

const { DropDownEditor } = Editors;

export const singleSelectEditor = (options: string[]) => {
  const _options = options.map(option => ({
    id: option,
    value: option,
    title: option,
    text: option,
  }));
  return <DropDownEditor options={_options} />;
};
