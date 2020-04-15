import React from "react";
import { CustomCellProps } from "./withCustomCell";
import DateFnsAdapter from "@date-io/date-fns";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { makeStyles, createStyles, Tooltip, Fade } from "@material-ui/core";
const dateFns = new DateFnsAdapter();
const useStyles = makeStyles(theme =>
  createStyles({
    root: {},
  })
);

export default function FiretableUser({ column, value }: CustomCellProps) {
  if (!value || !value.displayName || !value.timestamp) return <div />;

  const updatedAt = dateFns.format(value.timestamp.toDate(), "hh:mma ddMMM");
  console.log(updatedAt, value.timestamp);
  return (
    <Tooltip title={updatedAt}>
      <Chip
        avatar={<Avatar alt={value.displayName} src={value.photoURL} />}
        label={value.displayName}
        //  onDelete={handleDelete}
      />
    </Tooltip>
  );
}
