import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import { get } from "lodash";

import { useTheme, Grid, Chip } from "@material-ui/core";

import ConnectServiceSelect from "./ConnectServiceSelect";

export default function ConnectService({
  column,
  control,
  disabled,
  docRef,
}: ISideDrawerFieldProps) {
  const theme = useTheme();

  const config = column.config ?? {};
  const displayKey = config.titleKey ?? config.primaryKey;

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        const handleDelete = (hit: any) => () => {
          // if (multiple)
          onChange(
            value.filter(
              (v) => get(v, config.primaryKey) !== get(hit, config.primaryKey)
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
                docRef={docRef}
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
              <Grid
                container
                spacing={1}
                style={{ marginTop: theme.spacing(1) }}
              >
                {value.map((snapshot) => (
                  <Grid item key={get(snapshot, config.primaryKey)}>
                    <Chip
                      component="li"
                      size="medium"
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
