import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { IFieldProps } from "../utils";

import { Chip, Grid, useTheme } from "@material-ui/core";
import { get } from "lodash";
import ConnectServiceSelect, {
  IConnectServiceSelectProps,
} from "../../../ConnectServiceSelect";

export interface IConnectServiceProps
  extends IFieldProps,
    Partial<Omit<IConnectServiceSelectProps, "docRef">> {}

export default function ConnectService({
  control,
  name,
  editable,
  ...props
}: IConnectServiceProps) {
  const theme = useTheme();

  const disabled = editable === false;
  const { config, docRef } = props;
  if (!config) {
    return <></>;
  }

  const displayKey = config.titleKey ?? config.primaryKey;
  return (
    <Controller
      control={control}
      name={name}
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
                {...(props as any)}
                value={value}
                multiple={false}
                onChange={onChange}
                docRef={docRef}
                TextFieldProps={{
                  fullWidth: true,
                  onBlur,
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
