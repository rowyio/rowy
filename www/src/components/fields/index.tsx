import _find from "lodash/find";
import _get from "lodash/get";

import { FieldType } from "constants/fields";
import { IFieldConfig } from "./types";

// Import field configs
import Checkbox from "./Checkbox";

// Export field configs in order for FieldsDropdown
export const FIELDS: IFieldConfig[] = [Checkbox];

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
