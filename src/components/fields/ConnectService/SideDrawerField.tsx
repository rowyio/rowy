import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { get } from "lodash-es";

import { Grid, Chip } from "@mui/material";

import ConnectServiceSelect from "./ConnectServiceSelect";

export default function ConnectService({
  column,
  control,
  disabled,
  docRef,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};
  const displayKey = config.titleKey ?? config.primaryKey;

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleDelete = (hit: any) => () => {
          // if (multiple)
          onChange(
            value.filter(
              (v: any) =>
                get(v, config.primaryKey) !== get(hit, config.primaryKey)
            )
          );
          // else form.setFieldValue(field.name, []);
        };

        return (
          <>
            {!disabled && (
              <ConnectServiceSelect
                config={(config as any) ?? {}}
                value={value}
                onChange={onChange}
                docRef={docRef as any}
                TextFieldProps={{
                  label: "",
                  hiddenLabel: true,
                  fullWidth: true,
                  onBlur,
                  // SelectProps: {
                  //   renderValue: () => `${value?.length ?? 0} selected`,
                  // },
                }}
              />
            )}

            {Array.isArray(value) && (
              <Grid container spacing={0.5} style={{ marginTop: 2 }}>
                {value.map((snapshot) => (
                  <Grid item key={get(snapshot, config.primaryKey)}>
                    <Chip
                      component="li"
                      label={get(snapshot, displayKey)}
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
