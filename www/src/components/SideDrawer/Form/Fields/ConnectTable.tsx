import React from "react";
import { FieldProps } from "formik";

import { useTheme, Grid, Chip } from "@material-ui/core";

import ConnectTableSelect, {
  ConnectTableValue,
  IConnectTableSelectProps,
} from "components/ConnectTableSelect";

export default function ConnectTable({
  field,
  form,
  ...props
}: FieldProps<ConnectTableValue[]> & IConnectTableSelectProps) {
  const theme = useTheme();

  const handleDelete = (hit: any) => () => {
    // if (multiple)
    form.setFieldValue(
      field.name,
      field.value.filter(v => v.snapshot.objectID !== hit.objectID)
    );
    // else form.setFieldValue(field.name, []);
  };

  return (
    <>
      <ConnectTableSelect
        {...props}
        value={field.value}
        onChange={value => form.setFieldValue(field.name, value)}
        TextFieldProps={{
          fullWidth: true,
          error: !!(form.touched[field.name] && form.errors[field.name]),
          helperText:
            (form.touched[field.name] && form.errors[field.name]) || "",
          onBlur: () => form.setFieldTouched(field.name),
        }}
      />

      {Array.isArray(field.value) && (
        <Grid container spacing={1} style={{ marginTop: theme.spacing(1) }}>
          {field.value.map(({ snapshot }) => (
            <Grid item key={snapshot.objectID}>
              <Chip
                component="li"
                size="medium"
                label={props.config?.primaryKeys
                  ?.map((key: string) => snapshot[key])
                  .join(" ")}
                onDelete={handleDelete(snapshot)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
