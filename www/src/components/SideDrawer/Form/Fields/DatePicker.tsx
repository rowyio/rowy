import React from "react";

import { useTheme } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  fieldToKeyboardDatePicker,
  KeyboardDatePickerProps,
} from "formik-material-ui-pickers";
import { DATE_FORMAT } from "constants/dates";

export default function DatePicker(props: KeyboardDatePickerProps) {
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
    <KeyboardDatePicker
      variant="inline"
      inputVariant="filled"
      fullWidth
      margin="none"
      format={DATE_FORMAT}
      placeholder={DATE_FORMAT}
      InputAdornmentProps={{ style: { marginRight: theme.spacing(-1) } }}
      {...fieldToKeyboardDatePicker(props)}
      value={transformedValue}
      onChange={handleChange}
      label=""
      hiddenLabel
      id={`sidedrawer-field-${props.field.name}`}
    />
  );
}
