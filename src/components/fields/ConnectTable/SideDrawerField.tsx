import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Grid, Chip } from "@mui/material";

import ConnectTableSelect from "./ConnectTableSelect";

export default function ConnectTable({
  column,
  control,
  disabled,
  useFormMethods,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleDelete = (hit: any) => () => {
          // if (multiple)
          onChange(value.filter((v) => v.snapshot.objectID !== hit.objectID));
          // else form.setFieldValue(field.name, []);
        };

        return (
          <>
            {!disabled && (
              <ConnectTableSelect
                row={useFormMethods.getValues()}
                column={column}
                config={(config as any) ?? {}}
                value={value}
                onChange={onChange}
                TextFieldProps={{
                  label: "",
                  hiddenLabel: true,
                  fullWidth: true,
                  onBlur,
                  SelectProps: {
                    renderValue: () => `${value?.length ?? 0} selected`,
                  },
                }}
              />
            )}

            {Array.isArray(value) && (
              <Grid container spacing={0.5} style={{ marginTop: 2 }}>
                {value.map(({ snapshot }) => (
                  <Grid item key={snapshot.objectID}>
                    <Chip
                      component="li"
                      label={column.config?.primaryKeys
                        ?.map((key: string) => snapshot[key])
                        .join(" ")}
                      onDelete={disabled ? undefined : handleDelete(snapshot)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        );
      }}
    />
  );
}
