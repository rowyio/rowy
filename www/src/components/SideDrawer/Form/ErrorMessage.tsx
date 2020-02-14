import React from "react";
import { ErrorMessage as FormikErrorMessage, ErrorMessageProps } from "formik";

import { makeStyles, createStyles, FormHelperText } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { marginTop: theme.spacing(0.5) },
  })
);

export default function ErrorMessage(props: ErrorMessageProps) {
  const classes = useStyles();

  return (
    <FormikErrorMessage {...props}>
      {msg => (
        <FormHelperText error className={classes.root}>
          {msg}
        </FormHelperText>
      )}
    </FormikErrorMessage>
  );
}
