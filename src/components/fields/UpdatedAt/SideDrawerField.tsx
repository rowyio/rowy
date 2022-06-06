import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/utils";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

export default function UpdatedAt({ column, value }: ISideDrawerFieldProps) {
  if (!value) return <Box sx={fieldSx} />;

  const dateLabel = format(
    value.toDate ? value.toDate() : value,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <Box sx={[fieldSx, { fontVariantNumeric: "tabular-nums" }]}>
      {dateLabel}
    </Box>
  );
}
