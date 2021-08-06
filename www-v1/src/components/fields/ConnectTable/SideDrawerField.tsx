import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { useTheme, Grid, Chip } from "@material-ui/core";

import ConnectTableSelect from "./ConnectTableSelect";

export default function ConnectTable({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const theme = useTheme();

  const config = column.config ?? {};

  return (
    <Controller
      control={control}
      name={column.key}
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
                row={control.getValues()}
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
