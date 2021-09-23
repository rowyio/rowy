import { IBasicCellProps } from "../types";
import { format } from "date-fns";
import { DATE_FORMAT } from "constants/dates";

export default function Date_({
  value,
  format: formatProp,
}: IBasicCellProps & { format?: string }) {
  if (!!value && "toDate" in value) {
    try {
      const formatted = format(value.toDate(), formatProp || DATE_FORMAT);
      return (
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatted}</span>
      );
    } catch (e) {
      return null;
    }
  }

  return null;
}
