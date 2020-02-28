import React from "react";
import { FieldProps } from "formik";

import { useTheme, Grid } from "@material-ui/core";

import MultiSelect_, {
  IMultiSelectProps as IMultiSelectProps_,
} from "components/MultiSelect";
import FormattedChip from "components/FormattedChip";

export default function MultiSelect({
  field,
  form,
  ...props
}: FieldProps<string[]> & IMultiSelectProps_) {
  const theme = useTheme();

  const handleDelete = (index: number) => () => {
    const newValues = [...field.value];
    newValues.splice(index, 1);
    form.setFieldValue(field.name, newValues);
  };

  return (
    <>
      <MultiSelect_
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
          {field.value.map(
            (item, i) =>
              item?.length > 0 && (
                <Grid item key={item}>
                  <FormattedChip
                    size="medium"
                    label={item}
                    onDelete={handleDelete(i)}
                  />
                </Grid>
              )
          )}
        </Grid>
      )}
    </>
  );
}
