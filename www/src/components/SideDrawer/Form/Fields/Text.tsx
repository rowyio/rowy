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
  config: { maxLength: string };
}

export default function Text({
  control,
  name,
  docRef,
  fieldVariant = "short",
  editable,
  config,
  ...props
}: ITextProps) {
  const classes = useStyles();
  let variantProps = {};
  const { maxLength } = config;
  switch (fieldVariant) {
    case "long":
      variantProps = {
        multiline: true,
        InputProps: { classes: { multiline: classes.multiline } },
        inputProps: { rowsMin: 5, maxLength },
      };
      break;

    case "email":
      variantProps = {
        // type: "email",
        inputProps: { autoComplete: "email", maxLength },
      };
      break;

    case "phone":
      // TODO: add mask, validation
      variantProps = {
        type: "tel",
        inputProps: { autoComplete: "tel", maxLength },
      };
      break;

    case "number":
      variantProps = { inputMode: "numeric", pattern: "[0-9]*" };
      break;

    case "short":
    default:
      variantProps = { inputProps: { maxLength } };
      break;
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (e) => {
          if (fieldVariant === "number") onChange(Number(e.target.value));
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
