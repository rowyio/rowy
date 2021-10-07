import { IFilterOperator } from "../types";

export const filterOperators: IFilterOperator[] = [
  {
    value: "==",
    label: "is equal to",
  },
  {
    value: "!=",
    label: "not equal to",
  },
  {
    value: "array-contains",
    label: "contains",
  },
  {
    value: "array-contains-any",
    label: "has any",
  },
];
