import { ColumnConfig } from "@src/types/table";
import { FieldType } from "@src/constants/fields";
import { ArraySupportedFiledTypes } from "./SupportedTypes";
import { GeoPoint, DocumentReference } from "firebase/firestore";
export function getPseudoColumn(
  fieldType: FieldType,
  index: number,
  value: any
): ColumnConfig {
  return {
    fieldName: (+new Date()).toString(),
    index: index,
    key: (+new Date()).toString(),
    name: value + "",
    type: fieldType,
  };
}

// archive: detectType / TODO: remove
export function detectType(value: any): ArraySupportedFiledTypes {
  if (value === null) {
    return FieldType.reference;
  }
  console.log(typeof GeoPoint);
  console.log(value instanceof DocumentReference, value);

  if (typeof value === "object") {
    const keys = Object.keys(value);
    // console.log({ keys, value }, typeof value);
    if (keys.length === 2) {
      if (keys.includes("_lat") && keys.includes("_long")) {
        return FieldType.geoPoint;
      }
      if (keys.includes("nanoseconds") && keys.includes("seconds")) {
        return FieldType.dateTime;
      }
    }
    if (+new Date(value)) {
      return FieldType.dateTime;
    }
    return FieldType.json;
  }

  switch (typeof value) {
    case "bigint":
    case "number": {
      return FieldType.number;
    }
    case "string": {
      return FieldType.shortText;
    }
    case "boolean": {
      return FieldType.checkbox;
    }
    default: {
      return FieldType.shortText;
    }
  }
}
