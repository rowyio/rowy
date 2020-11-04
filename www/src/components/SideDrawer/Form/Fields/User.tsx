import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import {
  createStyles,
  makeStyles,
  Grid,
  Typography,
  Avatar,
} from "@material-ui/core";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "constants/dates";

const useStyles = makeStyles((theme) =>
  createStyles({
    labelContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      textAlign: "left",
      minHeight: 56,

      cursor: "default",
    },

    avatar: {
      width: 32,
      height: 32,
      marginRight: theme.spacing(1.5),
    },
  })
);

export default function User({ control, name }: IFieldProps) {
  const classes = useStyles();

  return (
    <Controller
      control={control}
      name={name}
      render={({ value }) => (
        <Grid container alignItems="center" className={classes.labelContainer}>
          <Grid item>
            <Avatar
              alt="Avatar"
              src={value.photoURL}
              className={classes.avatar}
            />
          </Grid>
          <Grid item>
            <Typography variant="body2">
              {value.displayName} ({value.email})
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {format(value.timestamp.toDate(), DATE_TIME_FORMAT)}
            </Typography>
          </Grid>
        </Grid>
      )}
    />
  );
}
