import React from "react";
import { CustomCellProps } from "./withCustomCell";

import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { makeStyles, createStyles, Tooltip, Fade } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {},
  })
);

export default function FiretableUser({ column, value }: CustomCellProps) {
  if (!value || !value.displayName) return <div />;

  return (
    <Chip
      avatar={<Avatar alt={value.displayName} src={value.photoURL} />}
      label={value.displayName}
      //  onDelete={handleDelete}
    />
  );
}
