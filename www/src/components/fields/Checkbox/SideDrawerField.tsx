import React from "react";
import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import {
  makeStyles,
  createStyles,
  ButtonBase,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
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

export default function Checkbox({ column, control }: ISideDrawerFieldProps) {
  const classes = useStyles();

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.checked);
        };

        const handleClick = () => onChange(!value);

        return (
          <ButtonBase className={classes.buttonBase} onClick={handleClick}>
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={value}
                  onChange={handleChange}
                  onBlur={onBlur}
                  disabled={column.editable === false}
                />
              }
              label={column.name}
              labelPlacement="start"
              classes={{ root: classes.formControlLabel, label: classes.label }}
            />
          </ButtonBase>
        );
      }}
    />
  );
}
