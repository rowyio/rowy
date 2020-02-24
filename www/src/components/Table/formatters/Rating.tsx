import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles } from "@material-ui/core";
import MuiRating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const useStyles = makeStyles(theme =>
  createStyles({
    rating: { color: theme.palette.text.secondary },
    iconEmpty: { color: theme.palette.text.secondary },
  })
);

function Rating({ row, column, value, onSubmit }: CustomCellProps) {
  const classes = useStyles();

  return (
    <MuiRating
      name={`${row.id}-${column.key}`}
      value={typeof value === "number" ? value : 0}
      onChange={(event, newValue) => onSubmit(newValue)}
      emptyIcon={<StarBorderIcon />}
      // TODO: Make this customisable in config
      max={4}
      classes={{ root: classes.rating, iconEmpty: classes.iconEmpty }}
    />
  );
}

export default withCustomCell(Rating);
