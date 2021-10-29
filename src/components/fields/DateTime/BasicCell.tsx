import { IBasicCellProps } from "../types";
import _isFunction from "lodash/isFunction";
import _isDate from "lodash/isDate";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

export default function DateTime({
  value,
  format: formatProp,
}: IBasicCellProps & { format?: string }) {
  if ((!!value && _isFunction(value.toDate)) || _isDate(value)) {
    try {
      const formatted = format(
        _isDate(value) ? value : value.toDate(),
        formatProp || DATE_TIME_FORMAT
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
