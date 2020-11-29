import _find from "lodash/find";
import _get from "lodash/get";

import { FieldType } from "constants/fields";
import { IFieldConfig } from "./types";

// Import field configs
import Checkbox from "./Checkbox";
import Date_ from "./Date";
import DateTime from "./DateTime";
import Duration from "./Duration";
import SubTable from "./SubTable";
import Action from "./Action";

// Export field configs in order for FieldsDropdown
export const FIELDS: IFieldConfig[] = [
  // TEXT
  // TODO: shortText,
  // TODO: longText,
  // TODO: email,
  // TODO: phone,
  // TODO: url,
  // NUMERIC
  Checkbox,
  // TODO: number,
  // TODO: percentage,
  // TODO: rating,
  // TODO: slider,
  // TODO: color,
  // DATE & TIME
  Date_,
  DateTime,
  Duration,
  // FILE
  // TODO: image,
  // TODO: file,
  // SELECT
  // TODO: singleSelect,
  // TODO: multiSelect,
  // CONNECTION
  SubTable,
  // TODO: connectTable,
  // TODO: connectService,
  // CODE
  // TODO: json,
  // TODO: code,
  // TODO: richText,
  // CLOUD FUNCTION
  Action,
  // TODO: derivative,
  // TODO: aggregate,
  // FIRETABLE
  // TODO: user,
  // TODO: id,
];

/**
 * Returns specific property of field config
 * @param fieldType
 */
export const getFieldProp = (
  prop: keyof IFieldConfig,
  fieldType: FieldType
) => {
  const field = _find(FIELDS, { type: fieldType });
  return _get(field, prop);
};

/**
 * Returns `true` if it receives an existing fieldType
 * @param fieldType
 */
export const isFieldType = (fieldType: any) => {
  const fieldTypes = FIELDS.map((field) => field.type);
  return fieldTypes.includes(fieldType);
};
