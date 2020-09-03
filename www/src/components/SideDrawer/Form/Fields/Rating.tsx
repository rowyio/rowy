import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import { makeStyles, createStyles, Grid } from "@material-ui/core";
import { Rating as MuiRating } from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0, 2),

      margin: 0,
      width: "100%",
      height: 56,
    },

    rating: { color: theme.palette.text.secondary },
    iconEmpty: { color: theme.palette.text.secondary },
  })
);

export default function Rating({ control, name, editable }: IFieldProps) {
  const classes = useStyles();

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => (
        <Grid container alignItems="center" className={classes.root}>
          <MuiRating
            disabled={editable === false}
            name={name}
            id={`sidedrawer-field-${name}`}
            value={typeof value === "number" ? value : 0}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            classes={{ root: classes.rating, iconEmpty: classes.iconEmpty }}
            // TODO: Make this customisable in column settings
            max={4}
          />
        </Grid>
      )}
    />
  );
}
