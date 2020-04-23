import React from "react";

import { useTheme } from "@material-ui/core";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import {
  fieldToKeyboardDateTimePicker,
  KeyboardDateTimePickerProps,
} from "formik-material-ui-pickers";
import { DATE_TIME_FORMAT } from "constants/dates";

import AccessTimeIcon from "@material-ui/icons/AccessTime";

export default function DateTimePicker(props: KeyboardDateTimePickerProps) {
  const theme = useTheme();

  let transformedValue = null;
  if (props.field.value && "toDate" in props.field.value)
    transformedValue = props.field.value.toDate();
  else if (props.field.value !== undefined)
    transformedValue = props.field.value;

  const handleChange = (date: Date | null) => {
    if (isNaN(date?.valueOf() ?? 0)) return;
    props.form.setFieldValue(props.field.name, date);
  };

  return (
    <KeyboardDateTimePicker
      variant="inline"
      inputVariant="filled"
      fullWidth
      margin="none"
      format={DATE_TIME_FORMAT}
      placeholder={DATE_TIME_FORMAT}
      InputAdornmentProps={{ style: { marginRight: theme.spacing(-1) } }}
      keyboardIcon={<AccessTimeIcon />}
      {...fieldToKeyboardDateTimePicker(props)}
      value={transformedValue}
      onChange={handleChange}
      label=""
      hiddenLabel
      id={`sidedrawer-field-${props.field.name}`}
    />
  );
}
