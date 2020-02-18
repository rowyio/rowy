import React from "react";
import { Field } from "formik";

import {
  makeStyles,
  createStyles,
  ButtonBase,
  FormControlLabel,
  SwitchProps as MuiSwitchProps,
} from "@material-ui/core";
import { Switch } from "formik-material-ui";
import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles(theme =>
  createStyles({
    buttonBase: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      width: "100%",
      display: "flex",
      textAlign: "left",
    },

    formControlLabel: {
      margin: 0,
      width: "100%",
      display: "flex",
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
      <ButtonBase className={classes.buttonBase}>
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
          classes={{ root: classes.formControlLabel, label: classes.label }}
        />
      </ButtonBase>

      <ErrorMessage name={props.name} />
    </>
  );
}
