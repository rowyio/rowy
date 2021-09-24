import { IBasicCellProps } from "../types";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "constants/dates";

export default function DateTime({
  value,
  format: formatProp,
}: IBasicCellProps & { format?: string }) {
  if (!!value && "toDate" in value) {
    try {
      const formatted = format(value.toDate(), formatProp || DATE_TIME_FORMAT);
      return (
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatted}</span>
      );
    } catch (e) {
      return null;
    }
  }

  return null;
}
