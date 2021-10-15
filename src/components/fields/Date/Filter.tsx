import { IFilterOperator } from "../types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "on",
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
    label: "before or on",
  },
  {
    value: ">=",
    label: "on or after",
  },
];

export const valueFormatter = (value: any) => {
  if (value && value.toDate) {
    return value.toDate();
  }
  return null;
};
