import { Control } from "react-hook-form";
import _isFunction from "lodash/isFunction";

import { FieldType } from "constants/fields";

export interface IFieldProps {
  control: Control;
  name: string;
  docRef: firebase.firestore.DocumentReference;
  editable?: boolean;
}

export type Values = { [key: string]: any };
export type Field = {
  type?: FieldType;
  name: string;
  label?: string;
  [key: string]: any;
};
export type Fields = (Field | ((values: Values) => Field))[];

export const initializeValue = (type) => {
  switch (type) {
    case FieldType.multiSelect:
    case FieldType.image:
    case FieldType.file:
      return [];

    case FieldType.singleSelect:
    case FieldType.date:
    case FieldType.dateTime:
      return null;

    case FieldType.checkbox:
      return false;

    case FieldType.json:
      return {};

    case FieldType.shortText:
    case FieldType.longText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.code:
    case FieldType.richText:
    case FieldType.number:
    default:
      break;
  }
};

export const getInitialValues = (fields: Fields): Values =>
  fields.reduce((acc, _field) => {
    const field = _isFunction(_field) ? _field({}) : _field;
    if (!field.name) return acc;
    let _type = field.type;
    if (field.config && field.config.renderFieldType) {
      _type = field.config.renderFieldType;
    }
    const value = initializeValue(_type);

    return { ...acc, [field.name]: value };
  }, {});
