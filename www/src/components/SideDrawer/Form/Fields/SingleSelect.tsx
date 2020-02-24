import React from "react";
import { FieldProps } from "formik";

import MultiSelect, { IMultiSelectProps } from "components/MultiSelect";

/**
 * Uses the MultiSelect UI, but writes values as a string,
 * not an array of strings
 */
export default function SingleSelect({
  field,
  form,
  ...props
}: FieldProps<string[]> & IMultiSelectProps) {
  const value = ([field.value] as unknown) as string[];
  const handleChange = (name, value) =>
    form.setFieldValue(name, value.join(", "));

  return (
    <MultiSelect
      {...props}
      field={field.name}
      value={value}
      onChange={handleChange}
      TextFieldProps={{
        fullWidth: true,
        label: "",
        hiddenLabel: true,
        error: !!(form.touched[field.name] && form.errors[field.name]),
        helperText: (form.touched[field.name] && form.errors[field.name]) || "",
        onBlur: () => form.setFieldTouched(field.name),
      }}
      freeText
      multiple={false}
    />
  );
}
