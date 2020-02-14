import React from "react";

import {
  makeStyles,
  createStyles,
  FormControl,
  FormControlLabel,
  Radio as MuiRadio,
  Divider,
} from "@material-ui/core";
import { RadioGroup, RadioGroupProps } from "formik-material-ui";

import Label from "../Label";
import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { display: "flex" },

    formControlLabel: {
      padding: theme.spacing(1.25, 0),
      marginLeft: theme.spacing(1),
    },

    divider: { marginLeft: theme.spacing(5) },
  })
);

export interface IRadioProps extends RadioGroupProps {
  options: (string | { value: string; label: React.ReactNode })[];
  label?: React.ReactNode;
}

export default function Radio({ options, label, ...props }: IRadioProps) {
  const classes = useStyles();

  return (
    <FormControl component="fieldset" className={classes.root}>
      <Label
        error={
          !!(
            props.form.errors[props.field.name] &&
            props.form.touched[props.field.name]
          )
        }
      >
        {label}
      </Label>

      <RadioGroup {...props}>
        {options.map(item => {
          let option: { label: React.ReactNode; value: string } = {
            label: "",
            value: "",
          };
          if (typeof item === "object") option = item;
          if (typeof item === "string") option = { label: item, value: item };

          return (
            <React.Fragment key={option.value}>
              <FormControlLabel
                key={option.value}
                value={option.value}
                label={option.label}
                control={
                  <MuiRadio
                  //disabled={isSubmitting}
                  />
                }
                classes={{ label: classes.formControlLabel }}
                //disabled={isSubmitting}
              />
              <Divider className={classes.divider} />
            </React.Fragment>
          );
        })}
      </RadioGroup>

      <ErrorMessage name={props.field.name} />
    </FormControl>
  );
}
