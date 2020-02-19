import React from "react";

import { TextField } from "@material-ui/core";
import { fieldToTextField, TextFieldProps } from "formik-material-ui";
import { MenuItem } from "@material-ui/core";

export interface ISingleSelectProps extends TextFieldProps {
  options: (string | { value: string; label: React.ReactNode })[];
}

/**
 * **NOTE:** This component will write an array of strings to the Formik values.
 * To be compatible with the MUI component, it transforms it to a string.
 * This is to allow cross-compatibility between Single and MultiSelect
 */
export default function SingleSelect({
  options = [],
  ...props
}: ISingleSelectProps) {
  return (
    <TextField
      {...fieldToTextField(props)}
      fullWidth
      margin="none"
      select
      variant="filled"
      // Convert Formik string[] value to string
      value={
        (Array.isArray(props.field.value)
          ? props.field.value[0]
          : props.field.value) ?? ""
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        props.form.setFieldValue(props.field.name, value ? [value] : []);
      }}
      label=""
      hiddenLabel
      SelectProps={{ labelId: `sidemodal-label-${props.field.name}` }}
    >
      {options.map(option => {
        if (typeof option === "object")
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        return (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
