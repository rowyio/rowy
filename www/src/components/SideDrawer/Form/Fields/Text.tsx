import React from "react";

import {
  makeStyles,
  createStyles,
  TextField,
  FilledTextFieldProps,
} from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    multiline: { padding: theme.spacing(2.25, 1.5) },
  })
);

export interface ITextProps extends Omit<FilledTextFieldProps, "variant"> {
  fieldVariant?: "short" | "long" | "email" | "phone" | "number" | "url";
  editable?: boolean;
}

export default function Text({
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
      variantProps = { type: "number" };
      break;

    case "short":
    default:
      break;
  }

  return (
    <TextField
      //key={`${props.form.initialValues.id}-${props.field.name}`}
      variant="filled"
      fullWidth
      margin="none"
      placeholder={props.label as string}
      {...variantProps}
      {...props}
      id={`sidedrawer-field-${props.name}`}
      label=""
      hiddenLabel
      disabled={editable === false}
      //InputProps={{ disableUnderline: true }}
    />
  );
}
