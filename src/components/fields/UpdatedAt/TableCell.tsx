import { IHeavyCellProps } from "../types";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function UpdatedBy({ row, column }: IHeavyCellProps) {
  const { table } = useProjectContext();
  const value = row[table?.auditFieldUpdatedBy || "_updatedBy"];

  if (!value || !value.timestamp) return null;
  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{dateLabel}</span>
  );
}
