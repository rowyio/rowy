import { useWatch } from "react-hook-form";
import { useAtom } from "jotai";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/utils";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";

export default function CreatedAt({ control, column }: ISideDrawerFieldProps) {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const value = useWatch({
    control,
    name: tableSettings.auditFieldCreatedBy || "_createdBy",
  });

  if (!value || !value.timestamp) return <Box sx={fieldSx} />;

  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <Box sx={[fieldSx, { fontVariantNumeric: "tabular-nums" }]}>
      {dateLabel}
    </Box>
  );
}
