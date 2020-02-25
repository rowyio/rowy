import React from "react";
import { FieldProps } from "formik";

import ConnectTableSelect, {
  ConnectTableValue,
  IConnectTableSelectProps,
} from "components/ConnectTableSelect";

export default function ConnectTable({
  field,
  form,
  ...props
}: FieldProps<ConnectTableValue[]> & IConnectTableSelectProps) {
  return (
    <ConnectTableSelect
      {...props}
      value={field.value}
      onChange={value => form.setFieldValue(field.name, value)}
      TextFieldProps={{
        fullWidth: true,
        error: !!(form.touched[field.name] && form.errors[field.name]),
        helperText: (form.touched[field.name] && form.errors[field.name]) || "",
        onBlur: () => form.setFieldTouched(field.name),
      }}
    />
  );
}
