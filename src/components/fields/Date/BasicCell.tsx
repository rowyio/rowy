import { IBasicCellProps } from "@src/components/fields/types";
import { isFunction, isDate } from "lodash-es";
import { format } from "date-fns";
import { DATE_FORMAT } from "@src/constants/dates";

export default function Date_({
  value,
  format: formatProp,
}: IBasicCellProps & { format?: string }) {
  if ((!!value && isFunction(value.toDate)) || isDate(value)) {
    try {
      const formatted = format(
        isDate(value) ? value : value.toDate(),
        formatProp || DATE_FORMAT
      );
      return (
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatted}</span>
      );
    } catch (e) {
      return null;
    }
  }

  return null;
}
