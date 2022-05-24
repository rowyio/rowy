import { useAtom } from "jotai";
import { IHeavyCellProps } from "@src/components/fields/types";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";

export default function UpdatedBy({ row, column }: IHeavyCellProps) {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const value = row[tableSettings.auditFieldUpdatedBy || "_updatedBy"];

  if (!value || !value.timestamp) return null;
  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{dateLabel}</span>
  );
}
