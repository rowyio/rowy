import React from "react";

import { TextField, TextFieldProps } from "formik-material-ui";

export interface ITextProps extends TextFieldProps {
  fieldVariant?: "short" | "long" | "email" | "phone" | "number" | "url";
}

export default function Text({
  fieldVariant = "short",
  hiddenLabel = false,
  ...props
}: ITextProps) {
  let variantProps = {};

  switch (fieldVariant) {
    case "long":
      variantProps = { multiline: true };
      break;

    case "email":
      variantProps = { type: "email", inputProps: { autoComplete: "email" } };
      break;

    case "phone":
      // TODO: add mask, validation
      variantProps = { type: "tel", inputProps: { autoComplete: "tel" } };
      break;

    case "number":
      variantProps = { type: "number" };
      break;

    case "url":
      variantProps = { type: "url" };
      break;

    case "short":
    default:
      break;
  }

  const overrideProps = hiddenLabel
    ? { label: "", "aria-label": props.label as string, hiddenLabel: true }
    : {};

  return (
    <TextField
      variant="filled"
      fullWidth
      margin="none"
      {...variantProps}
      {...props}
      {...overrideProps}
    />
  );
}
