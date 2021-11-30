import { useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function CreatedAt({ control, column }: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  const { table } = useProjectContext();
  const value = useWatch({
    control,
    name: table?.auditFieldCreatedBy || "_createdBy",
  });

  if (!value || !value.timestamp) return <div className={fieldClasses.root} />;

  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <div
      className={fieldClasses.root}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {dateLabel}
    </div>
  );
}
