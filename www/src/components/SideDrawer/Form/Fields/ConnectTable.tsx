import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import { useTheme, Grid, Chip } from "@material-ui/core";

import ConnectTableSelect, {
  IConnectTableSelectProps,
} from "components/ConnectTableSelect";

export interface IConnectTableProps
  extends IFieldProps,
    Partial<IConnectTableSelectProps> {}

export default function ConnectTable({
  control,
  docRef,
  name,
  editable,
  ...props
}: IConnectTableProps) {
  const theme = useTheme();

  const disabled = editable === false;

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleDelete = (hit: any) => () => {
          // if (multiple)
          onChange(value.filter((v) => v.snapshot.objectID !== hit.objectID));
          // else form.setFieldValue(field.name, []);
        };

        return (
          <>
            {!disabled && (
              <ConnectTableSelect
                {...(props as any)}
                value={value}
                onChange={onChange}
                TextFieldProps={{
                  fullWidth: true,
                  onBlur,
                  SelectProps: {
                    renderValue: () => `${value?.length ?? 0} selected`,
                  },
                }}
              />
            )}

            {Array.isArray(value) && (
              <Grid
                container
                spacing={1}
                style={{ marginTop: theme.spacing(1) }}
              >
                {value.map(({ snapshot }) => (
                  <Grid item key={snapshot.objectID}>
                    <Chip
                      component="li"
                      size="medium"
                      label={props.config?.primaryKeys
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
