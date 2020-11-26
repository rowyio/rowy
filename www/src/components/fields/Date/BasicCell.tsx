import React from "react";
import { IBasicCellProps } from "../types";
import { format } from "date-fns";
import { DATE_FORMAT } from "constants/dates";

export default function BasicCell({ value }: IBasicCellProps) {
  if (!!value && "toDate" in value) {
    try {
      const formatted = format(value, DATE_FORMAT);
      return <>{formatted}</>;
    } catch (e) {
      return null;
    }
  }

  return null;
}
