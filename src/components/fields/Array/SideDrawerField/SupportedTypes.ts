import { DocumentReference, GeoPoint, Timestamp } from "firebase/firestore";

import { FieldType } from "@src/components/fields/types";

import NumberValueSidebar from "@src/components/fields/Number/SideDrawerField";
import ShortTextValueSidebar from "@src/components/fields/ShortText/SideDrawerField";
import JsonValueSidebar from "@src/components/fields/Json/SideDrawerField";
import CheckBoxValueSidebar from "@src/components/fields/Checkbox/SideDrawerField";
import GeoPointValueSidebar from "@src/components/fields/GeoPoint/SideDrawerField";
import DateTimeValueSidebar from "@src/components/fields/DateTime/SideDrawerField";
import ReferenceValueSidebar from "@src/components/fields/Reference/SideDrawerField";

export const ArraySupportedFields = [
  FieldType.number,
  FieldType.shortText,
  FieldType.json,
  FieldType.checkbox,
  FieldType.geoPoint,
  FieldType.dateTime,
  FieldType.reference,
] as const;

export type ArraySupportedFiledTypes = typeof ArraySupportedFields[number];

export const SupportedTypes = {
  [FieldType.number]: {
    Sidebar: NumberValueSidebar,
    initialValue: 0,
    dataType: "common",
    instance: Object,
  },
  [FieldType.shortText]: {
    Sidebar: ShortTextValueSidebar,
    initialValue: "",
    dataType: "common",
    instance: Object,
  },
  [FieldType.checkbox]: {
    Sidebar: CheckBoxValueSidebar,
    initialValue: false,
    dataType: "common",
    instance: Object,
  },
  [FieldType.json]: {
    Sidebar: JsonValueSidebar,
    initialValue: {},
    sx: [
      {
        marginTop: "24px",
      },
    ],
    dataType: "common",
    instance: Object,
  },
  [FieldType.geoPoint]: {
    Sidebar: GeoPointValueSidebar,
    initialValue: new GeoPoint(0, 0),
    dataType: "firestore-type",
    instance: GeoPoint,
  },
  [FieldType.dateTime]: {
    Sidebar: DateTimeValueSidebar,
    initialValue: Timestamp.now(),
    dataType: "firestore-type",
    instance: Timestamp,
  },
  [FieldType.reference]: {
    Sidebar: ReferenceValueSidebar,
    initialValue: null,
    dataType: "firestore-type",
    instance: DocumentReference,
  },
};

export function detectType(value: any): ArraySupportedFiledTypes {
  if (value === null) {
    return FieldType.reference;
  }
  for (const supportedField of ArraySupportedFields) {
    if (SupportedTypes[supportedField].dataType === "firestore-type") {
      if (value instanceof SupportedTypes[supportedField].instance) {
        return supportedField;
      }
    }
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
    case "object": {
      return FieldType.json;
    }
    default: {
      return FieldType.shortText;
    }
  }
}
