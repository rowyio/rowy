import React from "react";
import { Controller ,useWatch} from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";


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

export default function Rating({   control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const value: number | undefined = useWatch({ control, name: column.key });
  const { max, precision } :{
    max: number;
    precision: number;
  } = {
    max:5, precision:1,...(column as any).config
  }

  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => (
        <Grid container alignItems="center" className={classes.root}>
          <MuiRating
            disabled={disabled}
            id={`sidedrawer-field-${column.key}`}
            value={typeof value === "number" ? value : 0}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            classes={{ root: classes.rating, iconEmpty: classes.iconEmpty }}
            max={max}
            precision={precision}
          />
        </Grid>
      )}
    />
  );
}
