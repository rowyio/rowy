import React from "react";
import { FieldProps } from "formik";

import { useTheme, Grid } from "@material-ui/core";

import MultiSelectA, { MultiSelectProps } from "@antlerengineering/multiselect";
import FormattedChip from "components/FormattedChip";

export default function MultiSelect({
  field,
  form,
  editable,
  config,
  ...props
}: FieldProps<string[]> &
  MultiSelectProps<string> & {
    config: { options: string[] };
    editable?: boolean;
  }) {
  const theme = useTheme();

  const handleDelete = (index: number) => () => {
    const newValues = [...field.value];
    newValues.splice(index, 1);
    form.setFieldValue(field.name, newValues);
  };

  return (
    <>
      <MultiSelectA
        {...props}
        options={config.options ?? []}
        multiple
        value={field.value ? field.value : []}
        onChange={value => form.setFieldValue(field.name, value)}
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

      {field.value && Array.isArray(field.value) && (
        <Grid container spacing={1} style={{ marginTop: theme.spacing(1) }}>
          {field.value.map(
            (item, i) =>
              item?.length > 0 && (
                <Grid item key={item}>
                  <FormattedChip
                    size="medium"
                    label={item}
                    onDelete={editable !== false ? handleDelete(i) : undefined}
                  />
                </Grid>
              )
          )}
        </Grid>
      )}
    </>
  );
}
