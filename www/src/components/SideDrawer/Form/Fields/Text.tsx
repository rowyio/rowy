import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import {
  makeStyles,
  createStyles,
  TextField,
  FilledTextFieldProps,
} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    multiline: { padding: theme.spacing(2.25, 1.5) },
  })
);

export interface ITextProps
  extends IFieldProps,
    Omit<FilledTextFieldProps, "variant" | "name"> {
  fieldVariant?: "short" | "long" | "email" | "phone" | "number" | "url";
}

export default function Text({
  control,
  name,
  docRef,
  fieldVariant = "short",
  editable,
  ...props
}: ITextProps) {
  const classes = useStyles();
  let variantProps = {};

  switch (fieldVariant) {
    case "long":
      variantProps = {
        multiline: true,
        InputProps: { classes: { multiline: classes.multiline } },
        inputProps: { rowsMin: 5 },
      };
      break;

    case "email":
      variantProps = {
        // type: "email",
        inputProps: { autoComplete: "email" },
      };
      break;

    case "phone":
      // TODO: add mask, validation
      variantProps = { type: "tel", inputProps: { autoComplete: "tel" } };
      break;

    case "number":
      variantProps = { inputMode: "numeric", pattern: "[0-9]*" };
      break;

    case "short":
    default:
      break;
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (e) => {
          if (fieldVariant === "number") onChange(parseInt(e.target.value, 10));
          else onChange(e.target.value);
        };

        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            placeholder={props.label as string}
            {...variantProps}
            {...props}
            onChange={handleChange}
            onBlur={onBlur}
            value={value}
            id={`sidedrawer-field-${name}`}
            label=""
            hiddenLabel
            disabled={editable === false}
          />
        );
      }}
    />
  );
}
