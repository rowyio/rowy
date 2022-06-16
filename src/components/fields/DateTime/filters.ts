import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { IFilterOperator } from "@src/components/fields/types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "equals",
    secondaryLabel: "==",
    value: "time-minute-equal",
  },
  {
    label: "not equal to",
    secondaryLabel: "!=",
    value: "!=",
  },
  {
    label: "before",
    secondaryLabel: "<",
    value: "<",
  },
  {
    label: "after",
    secondaryLabel: ">",
    value: ">",
  },
  {
    label: "before or at",
    secondaryLabel: "<=",
    value: "<=",
  },
  {
    label: "at or after",
    secondaryLabel: ">=",
    value: ">=",
  },
  {
    label: "where date is is",
    secondaryLabel: "date ==",
    value: "date-equal",
  },
  {
    label: "where date is before",
    secondaryLabel: "date <",
    value: "date-before",
  },
  {
    label: "where date is after",
    secondaryLabel: "date >",
    value: "date-after",
  },
  {
    label: "where date is before or on",
    secondaryLabel: "date <=",
    value: "date-before-equal",
  },
  {
    label: "where date is on or after",
    secondaryLabel: "date >=",
    value: "date-after-equal",
  },
];

export const valueFormatter = (value: any) => {
  if (value && value.toDate) return format(value.toDate(), DATE_TIME_FORMAT);
  return "";
};
