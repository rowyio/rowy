import { IFilterOperator } from "@src/components/fields/types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "is",
    secondaryLabel: "==",
    value: "=="
  },
  {
    label: "is not",
    secondaryLabel: "!=",
    value: "!="
}
];