import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { IFieldProps } from "../utils";

import {
  makeStyles,
  createStyles,
  TextField,
  FilledTextFieldProps,
} from "@material-ui/core";
import { emphasize } from "@material-ui/core/styles";
import { resultColorsScale } from "util/color";

const useStyles = makeStyles((theme) =>
  createStyles({
    pct: ({ value }: { value: number | undefined }) => ({
      borderRadius: theme.shape.borderRadius / 2,
      padding: theme.spacing(0.5, 1),

      backgroundColor: resultColorsScale(value as number).hex(),
      color: emphasize(resultColorsScale(value as number).hex(), 1),
    }),
  })
);

export interface ITextProps
  extends IFieldProps,
    Omit<FilledTextFieldProps, "variant" | "name"> {}

export default function Percentage({
  control,
  name,
  editable,
  ...props
}: IFieldProps) {
  const value: number | undefined = useWatch({ control, name });
  const classes = useStyles({ value });

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (e) => {
          onChange(Number(e.target.value));
        };

        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            {...props}
            onChange={handleChange}
            onBlur={onBlur}
            value={value}
            id={`sidedrawer-field-${name}`}
            type="number"
            inputProps={{ step: 0.1 }}
            label=""
            hiddenLabel
            disabled={editable === false}
            InputProps={{
              endAdornment: (
                <div className={classes.pct}>
                  {typeof value === "number" ? value * 100 : "–"}%
                </div>
              ),
            }}
          />
        );
      }}
    />
  );
}
