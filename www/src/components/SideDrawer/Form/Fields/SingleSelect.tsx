import React from "react";

import MultiSelect, { IMultiSelectProps } from "./MultiSelect";

/**
 * Uses the MultiSelect UI, but writes values as a string,
 * not an array of strings
 */
export default function SingleSelect({
  field,
  form,
  ...props
}: IMultiSelectProps) {
  const value = ([field.value] as unknown) as string[];
  const setFieldValue = (name, value) =>
    form.setFieldValue(name, value.join(", "));

  return (
    <MultiSelect
      {...props}
      field={{ ...field, value }}
      form={{ ...form, setFieldValue }}
      multiple={false}
    />
  );
}
