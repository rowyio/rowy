import { isDate, sortBy } from "lodash-es";
import { FieldType } from "@src/constants/fields";

export const SELECTABLE_TYPES = [
  FieldType.shortText,
  FieldType.longText,
  FieldType.richText,
  FieldType.email,
  FieldType.phone,

  FieldType.checkbox,
  FieldType.number,
  FieldType.percentage,

  FieldType.date,
  FieldType.dateTime,

  FieldType.url,
  FieldType.rating,

  FieldType.image,
  FieldType.file,

  FieldType.singleSelect,
  FieldType.multiSelect,

  FieldType.json,
  FieldType.code,

  FieldType.geoPoint,

  FieldType.color,
  FieldType.slider,

  FieldType.reference,
];

export const REGEX_EMAIL =
  /([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)/;
export const REGEX_PHONE =
  /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
export const REGEX_URL =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
export const REGEX_HTML = /<\/?[a-z][\s\S]*>/;

const inferTypeFromValue = (value: any) => {
  // by default the type of value is string, so trying to convert it to JSON/Object.
  try {
    value = JSON.parse(value);
  } catch (e) {}
  if (!value || typeof value === "function") return;

  if (Array.isArray(value) && typeof value[0] === "string")
    return FieldType.multiSelect;
  if (typeof value === "boolean") return FieldType.checkbox;
  if (isDate(value)) return FieldType.dateTime;
  // trying to convert the value to date
  if (typeof value !== "number" && +new Date(value)) {
    // date and time are separated by a blank space, checking if time present.
    if (value.split(" ").length > 1) {
      return FieldType.dateTime;
    }
    return FieldType.date;
  }

  if (typeof value === "object") {
    if ("hex" in value && "rgb" in value) return FieldType.color;
    if ("latitude" in value && "longitude" in value) return FieldType.geoPoint;
    if ("toDate" in value) return FieldType.dateTime;
    return FieldType.json;
  }

  if (typeof value === "number") {
    if (Math.abs(value) > 0 && Math.abs(value) < 1) return FieldType.percentage;
    return FieldType.number;
  }

  if (typeof value === "string") {
    if (REGEX_EMAIL.test(value)) return FieldType.email;
    if (REGEX_URL.test(value)) return FieldType.url;
    if (REGEX_PHONE.test(value)) return FieldType.phone;
    if (REGEX_HTML.test(value)) return FieldType.richText;
    if (value.length >= 50) return FieldType.longText;
    return FieldType.shortText;
  }

  return;
};

export const suggestType = (data: { [key: string]: any }[], field: string) => {
  const results: Record<string, number> = {};

  // console.log(data)
  data.forEach((row) => {
    const result = inferTypeFromValue(row[field]);
    if (!result) return;
    if (results[result] === undefined) results[result] = 1;
    else results[result] += 1;
  });

  const sortedResults = sortBy(Object.entries(results), 1).reverse();
  if (!sortedResults || !sortedResults[0]) return FieldType.json;
  const bestMatch = sortedResults[0][0];

  if (bestMatch === FieldType.shortText) {
    const values = data.map((row) => row[field]);
    const uniqueValues = new Set(values);
    const hasDuplicates = values.length !== uniqueValues.size;

    if (hasDuplicates && uniqueValues.size < 30) return FieldType.singleSelect;
  }

  return bestMatch;
};
