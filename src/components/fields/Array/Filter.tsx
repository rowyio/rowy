import { IFilterOperator } from "@src/components/fields/types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "equals",
    value: "==",
  },
  {
    label: "not equals",
    value: "!=",
  },
  {
    label: "includes",
    value: "in",
  },
  {
    label: "not includes",
    value: "not-in",
  },
  {
    label: "contains atleast one of the following",
    value: "array-contains-any",
  },
];
