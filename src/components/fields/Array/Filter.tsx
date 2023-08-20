import { IFilterOperator } from "@src/components/fields/types";

export const operators: IFilterOperator[] = [
  {
    label: "equals",
    value: "==",
  },
  {
    label: "not equals",
    value: "!=",
  },
  {
    label: "contains the following",
    value: "array-contains",
  },
  {
    label: "contains atleast one of the following",
    value: "array-contains-any",
  },
];
