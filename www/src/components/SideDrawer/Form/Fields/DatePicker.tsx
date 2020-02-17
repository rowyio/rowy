import React from "react";

import { useTheme } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  fieldToKeyboardDatePicker,
  KeyboardDatePickerProps,
} from "formik-material-ui-pickers";

export default function DatePicker(props: KeyboardDatePickerProps) {
  const theme = useTheme();

  let transformedValue = null;
  if (props.field.value && "toDate" in props.field.value)
    transformedValue = props.field.value.toDate();
  else if (props.field.value !== undefined)
    transformedValue = props.field.value;

  return (
    <KeyboardDatePicker
      variant="inline"
      inputVariant="filled"
      fullWidth
      margin="none"
      format="yyyy/MM/dd"
      placeholder="yyyy/MM/dd"
      InputAdornmentProps={{ style: { marginRight: theme.spacing(-1) } }}
      {...fieldToKeyboardDatePicker(props)}
      value={transformedValue}
      label=""
      hiddenLabel
      id={`sidemodal-field-${props.field.name}`}
    />
  );
}
