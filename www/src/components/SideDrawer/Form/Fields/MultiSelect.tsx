import React, { useState } from "react";
import { FieldProps } from "formik";

import _MultiSelect, {
  IMultiSelectProps as _IMultiSelectProps,
} from "components/MultiSelect";

export default function MultiSelect({
  field,
  form,
  ...props
}: FieldProps<string[]> & _IMultiSelectProps) {
  return (
    <_MultiSelect
      {...props}
      field={field.name}
      value={field.value}
      onChange={(fieldName, value) => form.setFieldValue(fieldName, value)}
      TextFieldProps={{
        fullWidth: true,
        label: "",
        hiddenLabel: true,
        error: !!(form.touched[field.name] && form.errors[field.name]),
        helperText: (form.touched[field.name] && form.errors[field.name]) || "",
        onBlur: () => form.setFieldTouched(field.name),
      }}
      freeText
    />
  );
}
