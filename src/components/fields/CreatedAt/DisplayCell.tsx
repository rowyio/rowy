import { IDisplayCellProps } from "@src/components/fields/types";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

export default function CreatedAt({ column, value }: IDisplayCellProps) {
  if (!value) return null;
  const dateLabel = format(
    value.toDate ? value.toDate() : value,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{dateLabel}</span>
  );
}
