import React from "react";
import { FieldProps } from "formik";

import { useTheme } from "@material-ui/core";

import MultiSelect, { IMultiSelectProps } from "components/MultiSelect";
import FormattedChip from "components/FormattedChip";

/**
 * Uses the MultiSelect UI, but writes values as a string,
 * not an array of strings
 */
export default function SingleSelect({
  field,
  form,
  ...props
}: FieldProps<string[]> & IMultiSelectProps) {
  const theme = useTheme();

  const value = ([field.value] as unknown) as string[];
  const handleChange = value =>
    form.setFieldValue(field.name, value.join(", "));

  return (
    <>
      <MultiSelect
        {...props}
        value={value}
        onChange={handleChange}
        TextFieldProps={{
          fullWidth: true,
          label: "",
          hiddenLabel: true,
          error: !!(form.touched[field.name] && form.errors[field.name]),
          helperText:
            (form.touched[field.name] && form.errors[field.name]) || "",
          onBlur: () => form.setFieldTouched(field.name),
        }}
        searchable
        freeText
        multiple={false}
      />

      {field.value?.length > 0 && (
        <div style={{ marginTop: theme.spacing(1) }}>
          <FormattedChip size="medium" label={field.value} />
        </div>
      )}
    </>
  );
}
