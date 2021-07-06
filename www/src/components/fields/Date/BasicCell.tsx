import { IBasicCellProps } from "../types";
import { format } from "date-fns";
import { DATE_FORMAT } from "constants/dates";
import { DateIcon } from ".";

export default function Date_({ value }: IBasicCellProps) {
  if (!!value && "toDate" in value) {
    try {
      const formatted = format(value.toDate(), DATE_FORMAT);
      return (
        <>
          <DateIcon style={{ marginRight: 5 }} />
          {formatted}
        </>
      );
    } catch (e) {
      return null;
    }
  }

  return null;
}
