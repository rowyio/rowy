import React from "react";
import { FieldProps } from "formik";

import { useTheme, Grid, Chip } from "@material-ui/core";

import _MultiSelect, {
  IMultiSelectProps as _IMultiSelectProps,
} from "components/MultiSelect";

export default function MultiSelect({
  field,
  form,
  ...props
}: FieldProps<string[]> & _IMultiSelectProps) {
  const theme = useTheme();

  const handleDelete = (index: number) => () => {
    const newValues = [...field.value];
    newValues.splice(index, 1);
    form.setFieldValue(field.name, newValues);
  };

  return (
    <>
      <_MultiSelect
        {...props}
        value={field.value}
        onChange={value => form.setFieldValue(field.name, value)}
        TextFieldProps={{
          fullWidth: true,
          label: "",
          hiddenLabel: true,
          error: !!(form.touched[field.name] && form.errors[field.name]),
          helperText:
            (form.touched[field.name] && form.errors[field.name]) || "",
          onBlur: () => form.setFieldTouched(field.name),
        }}
        freeText
      />

      {Array.isArray(field.value) && (
        <Grid container spacing={1} style={{ marginTop: theme.spacing(1) }}>
          {field.value.map((item, i) => (
            <Grid item key={item}>
              <Chip
                component="li"
                size="medium"
                label={item}
                onDelete={handleDelete(i)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
