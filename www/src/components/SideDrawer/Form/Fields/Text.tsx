import React from "react";

import { makeStyles, createStyles } from "@material-ui/core";
import { TextField, TextFieldProps } from "formik-material-ui";

const useStyles = makeStyles(theme =>
  createStyles({
    multiline: { padding: theme.spacing(2.25, 1.5) },
  })
);

export interface ITextProps extends TextFieldProps {
  fieldVariant?: "short" | "long" | "email" | "phone" | "number" | "url";
}

export default function Text({ fieldVariant = "short", ...props }: ITextProps) {
  const classes = useStyles();
  let variantProps = {};

  switch (fieldVariant) {
    case "long":
      variantProps = {
        multiline: true,
        InputProps: { classes: { multiline: classes.multiline } },
      };
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

  return (
    <TextField
      variant="filled"
      fullWidth
      margin="none"
      placeholder={props.label as string}
      {...variantProps}
      {...props}
      id={`sidedrawer-field-${props.field.name}`}
      label=""
      hiddenLabel
      //InputProps={{ disableUnderline: true }}
    />
  );
}
