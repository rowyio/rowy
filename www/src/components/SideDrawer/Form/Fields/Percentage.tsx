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
import { resultColorsScale } from "utils/color";

const useStyles = makeStyles((theme) =>
  createStyles({
    resultColor: ({ value }: { value: number | undefined }) => ({
      backgroundColor:
        typeof value === "number"
          ? resultColorsScale(value).hex() + " !important"
          : undefined,
      color:
        typeof value === "number"
          ? emphasize(resultColorsScale(value).hex(), 1)
          : undefined,
    }),

    underline: {
      "&::after": {
        borderColor: theme.palette.text.primary,
      },
    },
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
          onChange(Number(e.target.value) / 100);
        };

        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            {...props}
            onChange={handleChange}
            onBlur={onBlur}
            value={typeof value === "number" ? value * 100 : value}
            id={`sidedrawer-field-${name}`}
            type="number"
            label=""
            hiddenLabel
            disabled={editable === false}
            InputProps={{
              endAdornment: "%",
              classes: {
                root: classes.resultColor,
                underline: classes.underline,
              },
            }}
          />
        );
      }}
    />
  );
}
