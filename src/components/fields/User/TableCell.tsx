import { IHeavyCellProps } from "../types";

import { Tooltip, Stack, Avatar } from "@mui/material";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

export default function User({ value, column }: IHeavyCellProps) {
  if (!value || !value.displayName) return null;

  const chip = (
    <Stack spacing={0.75} direction="row" alignItems="center">
      <Avatar
        alt="Avatar"
        src={value.photoURL}
        style={{ width: 20, height: 20 }}
      />
      <span>{value.displayName}</span>
    </Stack>
  );

  if (!value.timestamp) return chip;

  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    column.config?.format || DATE_TIME_FORMAT
  );

  return <Tooltip title={dateLabel}>{chip}</Tooltip>;
}
