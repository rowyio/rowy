import React from "react";
import { FieldProps } from "formik";

import { makeStyles, createStyles, Grid } from "@material-ui/core";
import { Rating as MuiRating } from "@material-ui/lab";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles(theme =>
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

export interface IRatingProps extends FieldProps {
  editable?: boolean;
}

export default function Rating(props: IRatingProps) {
  const classes = useStyles();

  return (
    <>
      <Grid container alignItems="center" className={classes.root}>
        <MuiRating
          disabled={props.editable === false}
          name={props.field.name}
          id={`sidedrawer-field-${props.field.name}`}
          value={typeof props.field.value === "number" ? props.field.value : 0}
          onChange={(event, newValue) => {
            props.form.setFieldValue(props.field.name, newValue);
          }}
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
          classes={{ root: classes.rating, iconEmpty: classes.iconEmpty }}
          // TODO: Make this customisable in column settings
          max={4}
        />
      </Grid>

      <ErrorMessage name={props.field.name} />
    </>
  );
}
