import React from "react";

import { useTheme } from "@material-ui/core";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import {
  fieldToKeyboardDateTimePicker,
  KeyboardDateTimePickerProps,
} from "formik-material-ui-pickers";

import AccessTimeIcon from "@material-ui/icons/AccessTime";

export default function DateTimePicker(props: KeyboardDateTimePickerProps) {
  const theme = useTheme();

  let transformedValue = null;
  if (props.field.value && "toDate" in props.field.value)
    transformedValue = props.field.value.toDate();
  else if (props.field.value !== undefined)
    transformedValue = props.field.value;

  return (
    <KeyboardDateTimePicker
      variant="inline"
      inputVariant="filled"
      fullWidth
      margin="none"
      format="yyyy/MM/dd h:mm aaaa"
      placeholder="yyyy/MM/dd h:mm aaaa"
      InputAdornmentProps={{ style: { marginRight: theme.spacing(-1) } }}
      keyboardIcon={<AccessTimeIcon />}
      {...fieldToKeyboardDateTimePicker(props)}
      value={transformedValue}
      label=""
      hiddenLabel
      id={`sidedrawer-field-${props.field.name}`}
    />
  );
}
