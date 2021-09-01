import { IBasicCellProps } from "../types";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "constants/dates";
import { DateTimeIcon } from ".";

export default function DateTime({ value }: IBasicCellProps) {
  if (!!value && "toDate" in value) {
    try {
      const formatted = format(value.toDate(), DATE_TIME_FORMAT);
      return (
        <>
          <DateTimeIcon style={{ marginRight: 5 }} />
          {formatted}
        </>
      );
    } catch (e) {
      return null;
    }
  }

  return null;
}
