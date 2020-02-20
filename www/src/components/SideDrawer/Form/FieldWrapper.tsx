import React from "react";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  TextField,
} from "@material-ui/core";

import { FieldType, getFieldIcon } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    header: {
      marginBottom: theme.spacing(1),
      color: theme.palette.text.disabled,
    },
    iconContainer: {
      marginRight: theme.spacing(0.5),
      "& svg": { display: "block" },
    },

    disabledText: {
      paddingLeft: theme.spacing(3 + 0.5),
      color: theme.palette.text.disabled,

      whiteSpace: "normal",
      wordBreak: "break-all",
    },
  })
);

export interface IFieldWrapperProps {
  children?: React.ReactNode;
  type: FieldType;
  name?: string;
  label?: React.ReactNode;
  debugText?: React.ReactNode;
}

export default function FieldWrapper({
  children,
  type,
  name,
  label,
  debugText,
}: IFieldWrapperProps) {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Grid
        container
        alignItems="center"
        className={classes.header}
        component="label"
        id={`sidedrawer-label-${name}`}
        htmlFor={`sidedrawer-field-${name}`}
      >
        <Grid item className={classes.iconContainer}>
          {getFieldIcon(type)}
        </Grid>
        <Grid item xs>
          <Typography variant="caption">{label}</Typography>
        </Grid>
      </Grid>

      {children ??
        (!debugText && (
          <Typography variant="body2" className={classes.disabledText}>
            This field can’t be edited here.
          </Typography>
        ))}

      {debugText && (
        <Typography variant="body2" className={classes.disabledText}>
          {debugText}
        </Typography>
      )}
    </Grid>
  );
}
