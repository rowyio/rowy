import { format } from "date-fns";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "@src/constants/dates";
import { IFilterOperator } from "@src/components/fields/types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "equals",
    secondaryLabel: "==",
    value: "time-minute-equal",
    group: "Date & Time",
  },
  {
    label: "not equal to",
    secondaryLabel: "!=",
    value: "!=",
    group: "Date & Time",
  },
  {
    label: "before",
    secondaryLabel: "<",
    value: "<",
    group: "Date & Time",
  },
  {
    label: "after",
    secondaryLabel: ">",
    value: ">",
    group: "Date & Time",
  },
  {
    label: "before or at",
    secondaryLabel: "<=",
    value: "<=",
    group: "Date & Time",
  },
  {
    label: "at or after",
    secondaryLabel: ">=",
    value: ">=",
    group: "Date & Time",
  },
  {
    label: "where date is",
    secondaryLabel: "date ==",
    value: "date-equal",
    group: "Date",
  },
  {
    label: "where date is before",
    secondaryLabel: "date <",
    value: "date-before",
    group: "Date",
  },
  {
    label: "where date is after",
    secondaryLabel: "date >",
    value: "date-after",
    group: "Date",
  },
  {
    label: "where date is before or on",
    secondaryLabel: "date <=",
    value: "date-before-equal",
    group: "Date",
  },
  {
    label: "where date is on or after",
    secondaryLabel: "date >=",
    value: "date-after-equal",
    group: "Date",
  },
];

export const valueFormatter = (value: any, operator: string) => {
  if (value && value.toDate)
    return format(
      value.toDate(),
      operator.startsWith("date") ? DATE_FORMAT : DATE_TIME_FORMAT
    );
  return "";
};
