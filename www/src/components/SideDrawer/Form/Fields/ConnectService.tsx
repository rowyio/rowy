import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { IFieldProps } from "../utils";
import { inspect } from "util";
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
          onChange(null);
        };

        return (
          <>
            {!disabled && (
              <ConnectServiceSelect
                {...(props as any)}
                value={value}
                row={control.defaultValuesRef.current}
                multiple={false}
                onChange={onChange}
                docRef={docRef}
                TextFieldProps={{
                  fullWidth: true,
                  onBlur,
                }}
              />
            )}
            {value && (
              <Grid
                container
                spacing={1}
                style={{ marginTop: theme.spacing(1) }}
              >
                <Grid item key={get(value, config.primaryKey)}>
                  <Chip
                    component="li"
                    size="medium"
                    label={get(value, displayKey)}
                    onDelete={disabled ? undefined : handleDelete(value)}
                  />
                </Grid>
              </Grid>
            )}
          </>
        );
      }}
    />
  );
}
