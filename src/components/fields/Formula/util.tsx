import { FieldType } from "@src/constants/fields";
import { isEqual } from "lodash-es";
import { useMemo, useRef } from "react";

export function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>(value);
  const signalRef = useRef<number>(0);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ref.current, [signalRef.current]);
}

export const ignoredColumns = [
  FieldType.subTable,
  FieldType.derivative,
  FieldType.formula,
  FieldType.connector,
  FieldType.subTable,
  FieldType.reference,
  FieldType.connectTable,
  FieldType.connectService,
];

export const typeDefs = (type: FieldType) => {
  switch (type) {
    case FieldType.shortText:
    case FieldType.longText:
    case FieldType.richText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.url:
    case FieldType.singleSelect:
      return "string | undefined";
    case FieldType.multiSelect:
      return "Array | undefined";
    case FieldType.number:
    case FieldType.rating:
    case FieldType.slider:
    case FieldType.percentage:
      return "number | undefined";
    case FieldType.checkbox:
      return "boolean | undefined";
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.duration:
      return "{ seconds: number; nanoseconds: number; }";
  }
  return "any";
};
