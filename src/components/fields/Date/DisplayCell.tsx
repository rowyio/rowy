import { IDisplayCellProps } from "@src/components/fields/types";
import { isFunction, isDate } from "lodash-es";
import { format } from "date-fns";
import { DATE_FORMAT } from "@src/constants/dates";

export default function Date_({ value, column }: IDisplayCellProps) {
  if ((!!value && isFunction(value.toDate)) || isDate(value)) {
    try {
      const formatted = format(
        isDate(value) ? value : value.toDate(),
        column.config?.format || DATE_FORMAT
      );
      return (
        <div
          style={{
            fontVariantNumeric: "tabular-nums",
            padding: "0 var(--cell-padding)",
          }}
        >
          {formatted}
        </div>
      );
    } catch (e) {
      return null;
    }
  }

  return null;
}
