import { IFilterOperator } from "@src/components/fields/types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "is",
    secondaryLabel: "==",
    value: "color-equal",
  },
  {
    label: "is not",
    secondaryLabel: "!=",
    value: "color-not-equal",
  },
];

export const valueFormatter = (value: any) => {
  if (value && value.hex) {
    return value.hex.toString();
  }
  return "";
};
