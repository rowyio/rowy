import { format } from "date-fns";
import { DATE_FORMAT } from "@src/constants/dates";
import { IFilterOperator } from "@src/components/fields/types";

export const filterOperators: IFilterOperator[] = [
  {
    label: "is",
    secondaryLabel: "==",
    value: "date-equal",
  },
  {
    label: "before",
    secondaryLabel: "<",
    value: "date-before",
  },
  {
    label: "after",
    secondaryLabel: ">",
    value: "date-after",
  },
  {
    label: "before or on",
    secondaryLabel: "<=",
    value: "date-before-equal",
  },
  {
    label: "on or after",
    secondaryLabel: ">=",
    value: "date-after-equal",
  },
];

export const valueFormatter = (value: any) => {
  if (value && value.toDate) return format(value.toDate(), DATE_FORMAT);
  return "";
};
