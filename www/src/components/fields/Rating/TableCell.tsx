import React from "react";
import { ICustomCellProps } from "../types";
import { makeStyles, createStyles } from "@material-ui/core";
import MuiRating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const useStyles = makeStyles((theme) =>
  createStyles({
    rating: { color: theme.palette.text.secondary },
    iconEmpty: { color: theme.palette.text.secondary },
  })
);

export default function Rating({
  row,
  column,
  value,
  onSubmit,
}: ICustomCellProps) {
  const classes = useStyles();
  const { max, precision } = ((column as any).config ?? {
    max:5, precision:1
  }) as {
    max: number;
    precision: number;
  };
  return (
    <MuiRating
      name={`${row.id}-${column.key as string}`}
      value={typeof value === "number" ? value : 0}
      onClick={(e) => e.stopPropagation()}
      disabled={column.editable === false}
      onChange={(_, newValue) => onSubmit(newValue)}
      emptyIcon={<StarBorderIcon />}
      // TODO: Make this customisable in config
      max={max}
      precision={precision}
      classes={{ root: classes.rating, iconEmpty: classes.iconEmpty }}
    />
  );
}

