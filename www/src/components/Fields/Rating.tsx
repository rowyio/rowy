import React from "react";

import { makeStyles, createStyles } from "@material-ui/core";
import MuiRating from "@material-ui/lab/Rating";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const useStyles = makeStyles(theme =>
  createStyles({
    rating: { color: theme.palette.text.secondary },
    iconEmpty: { color: theme.palette.text.secondary },
  })
);

// TODO: Create an interface for props

interface Props {
  value: number;
  row: { id: string };
  column: any;
  onSubmit: Function;
  isScrolling: boolean;
}
const Rating = (props: Props) => {
  const { value, row, column, onSubmit } = props;
  const classes = useStyles();

  //if (isScrolling) return <div />;

  return (
    <MuiRating
      // TODO: make it unique for each
      key={`rating-controlled-${row.id}-${column.key}`}
      name={`rating-controlled-${row.id}-${column.key}`}
      value={typeof value === "number" ? value : 0}
      onChange={(event, newValue) => {
        onSubmit(newValue);
      }}
      emptyIcon={<StarBorderIcon fontSize="inherit" />}
      max={4}
      classes={{ root: classes.rating, iconEmpty: classes.iconEmpty }}
    />
  );
};
export default Rating;
