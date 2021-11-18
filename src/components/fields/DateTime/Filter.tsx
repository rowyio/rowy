import { IFilterOperator } from "../types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "at",
    value: "==",
  },
  {
    value: "!=",
    label: "not equal to",
  },
  {
    label: "before",
    value: "<",
  },
  {
    label: "after",
    value: ">",
  },
  {
    value: "<=",
    label: "before or at",
  },
  {
    value: ">=",
    label: "at or after",
  },
];

export const valueFormatter = (value: any) => {
  if (value && value.toDate) {
    return value.toDate();
  }
  return null;
};
