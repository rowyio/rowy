import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { Tooltip, Chip, Avatar } from "@material-ui/core";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "constants/dates";

export default function User({ value }: CustomCellProps) {
  if (!value || !value.displayName || !value.timestamp) return null;

  return (
    <Tooltip title={format(value.timestamp.toDate(), DATE_TIME_FORMAT)}>
      <Chip
        avatar={<Avatar alt="Avatar" src={value.photoURL} />}
        label={value.displayName}
      />
    </Tooltip>
  );
}
