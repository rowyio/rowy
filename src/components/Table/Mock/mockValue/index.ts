import { FieldType } from "@src/constants/fields";
import { fileValueConverter } from "./file";
import { referenceValueConverter } from "./reference";

export const VALUE_CONVERTERS: Partial<{
  [key in FieldType]: (value: any) => any;
}> = {
  [FieldType.image]: fileValueConverter,
  [FieldType.reference]: referenceValueConverter,
  [FieldType.file]: fileValueConverter,
};

export default function convert(value: any, type: FieldType) {
  const converter = VALUE_CONVERTERS[type];
  if (converter) {
    return converter(value);
  }

  return value;
}
