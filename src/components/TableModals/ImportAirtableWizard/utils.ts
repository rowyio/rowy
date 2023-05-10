import { sortBy } from "lodash-es";
import { FieldType } from "@src/constants/fields";
import {
  REGEX_EMAIL,
  REGEX_PHONE,
  REGEX_URL,
  REGEX_HTML,
} from "@src/components/TableModals/ImportExistingWizard/utils";
import { isValid as isValidDate, parseISO } from "date-fns";

export const inferTypeFromValue = (value: any) => {
  if (Array.isArray(value) && typeof value[0] === "string")
    return FieldType.multiSelect;
  if (typeof value === "boolean") return FieldType.checkbox;

  if (typeof value === "object") {
    if ("hex" in value && "rgb" in value) return FieldType.color;
    if ("toDate" in value) return FieldType.dateTime;
    return FieldType.json;
  }

  if (typeof value === "number") {
    if (Math.abs(value) > 0 && Math.abs(value) < 1) return FieldType.percentage;
    return FieldType.number;
  }

  if (typeof value === "string") {
    if (isValidDate(parseISO(value))) return FieldType.dateTime;
    if (REGEX_EMAIL.test(value)) return FieldType.email;
    if (REGEX_PHONE.test(value)) return FieldType.phone;
    if (REGEX_URL.test(value)) return FieldType.url;
    if (REGEX_HTML.test(value)) return FieldType.richText;
    if (value.length >= 50) return FieldType.longText;
    return FieldType.shortText;
  }

  return;
};
export const suggestType = (data: { [key: string]: any }[], field: string) => {
  const results: Record<string, number> = {};

  data.forEach((record) => {
    const result = inferTypeFromValue(record.fields[field]);
    if (!result) return;
    if (results[result] === undefined) results[result] = 1;
    else results[result] += 1;
  });

  const sortedResults = sortBy(Object.entries(results), 1).reverse();
  if (!sortedResults || !sortedResults[0]) return FieldType.json;
  const bestMatch = sortedResults[0][0];

  if (bestMatch === FieldType.shortText) {
    const values = data.map((record) => record.fields[field]);
    const uniqueValues = new Set(values);
    const hasDuplicates = values.length !== uniqueValues.size;

    if (hasDuplicates && uniqueValues.size < 30) return FieldType.singleSelect;
  }

  return bestMatch;
};

export const fieldParser = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
      return (v: string) => {
        const date = parseISO(v);
        return isValidDate(date) ? new Date(date) : null;
      };
    default:
      return (v: any) => v;
  }
};
