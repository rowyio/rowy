import React from "react";
import { FieldProps } from "formik";

import { useTheme } from "@material-ui/core";

import MultiSelect, { MultiSelectProps } from "@antlerengineering/multiselect";
import FormattedChip from "components/FormattedChip";

/**
 * Uses the MultiSelect UI, but writes values as a string,
 * not an array of strings
 */
export default function SingleSelect({
  field,
  form,
  editable,
  ...props
}: FieldProps<string> & MultiSelectProps<string> & { editable: boolean }) {
  const theme = useTheme();

  const handleChange = value => form.setFieldValue(field.name, value);

  return (
    <>
      <MultiSelect
        {...props}
        multiple={false}
        value={field.value}
        onChange={handleChange}
        disabled={editable === false}
        TextFieldProps={{
          label: "",
          hiddenLabel: true,
          error: !!(form.touched[field.name] && form.errors[field.name]),
          helperText:
            (form.touched[field.name] && form.errors[field.name]) || "",
          onBlur: () => form.setFieldTouched(field.name),
        }}
        searchable
        freeText={false}
      />

      {field.value?.length > 0 && (
        <div style={{ marginTop: theme.spacing(1) }}>
          <FormattedChip size="medium" label={field.value} />
        </div>
      )}
    </>
  );
}
