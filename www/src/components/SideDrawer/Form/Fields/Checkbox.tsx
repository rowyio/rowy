import React from "react";
import { Controller, Control } from "react-hook-form";

import {
  makeStyles,
  createStyles,
  ButtonBase,
  FormControlLabel,
  Switch,
  SwitchProps as MuiSwitchProps,
} from "@material-ui/core";

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
  control: Control;
  name: string;
  label?: React.ReactNode;
  editable?: boolean;
}

export default function Checkbox({
  control,
  label,
  name,
  editable,
  ...props
}: ICheckboxProps) {
  const classes = useStyles();

  return (
    <>
      <ButtonBase className={classes.buttonBase}>
        <FormControlLabel
          control={
            <Controller
              control={control}
              name={name}
              render={({ onChange, onBlur, value }) => {
                const handleChange = (
                  event: React.ChangeEvent<HTMLInputElement>
                ) => {
                  onChange(event.target.checked);
                };

                return (
                  <Switch
                    color="secondary"
                    {...props}
                    checked={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    disabled={editable === false}
                  />
                );
              }}
            />
          }
          label={label}
          labelPlacement="start"
          classes={{ root: classes.formControlLabel, label: classes.label }}
        />
      </ButtonBase>
    </>
  );
}
