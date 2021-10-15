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
        const handleDelete = (docPath: string) => () => {
          if (column.config?.multiple === false) onChange(null);
          else onChange(value.filter((v) => v.docPath !== docPath));
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
                }}
              />
            )}

            {value && (
              <Grid container spacing={0.5} style={{ marginTop: 2 }}>
                {Array.isArray(value) ? (
                  value.map(({ snapshot, docPath }) => (
                    <Grid item key={docPath}>
                      <Chip
                        component="li"
                        label={column.config?.primaryKeys
                          ?.map((key: string) => snapshot[key])
                          .join(" ")}
                        onDelete={disabled ? undefined : handleDelete(docPath)}
                      />
                    </Grid>
                  ))
                ) : value ? (
                  <Grid item>
                    <Chip
                      component="li"
                      label={column.config?.primaryKeys
                        ?.map((key: string) => value.snapshot[key])
                        .join(" ")}
                      onDelete={
                        disabled ? undefined : handleDelete(value.docPath)
                      }
                    />
                  </Grid>
                ) : null}
              </Grid>
            )}
          </>
        );
      }}
    />
  );
}
