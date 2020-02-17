import React from "react";
import { Field } from "formik";

import {
  makeStyles,
  createStyles,
  FormControlLabel,
  SwitchProps as MuiSwitchProps,
} from "@material-ui/core";
import { Switch } from "formik-material-ui";
import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      margin: 0,
      width: "100%",
    },

    label: {
      flexGrow: 1,
      whiteSpace: "normal",
    },
  })
);

export interface ICheckboxProps extends MuiSwitchProps {
  name: string;
  label?: React.ReactNode;
}

export default function Checkbox({ label, ...props }: ICheckboxProps) {
  const classes = useStyles();

  return (
    <>
      <FormControlLabel
        control={
          <Field
            component={Switch}
            color="primary"
            {...props}
            type="checkbox"
          />
        }
        label={label}
        labelPlacement="start"
        classes={classes}
      />

      <ErrorMessage name={props.name} />
    </>
  );
}
