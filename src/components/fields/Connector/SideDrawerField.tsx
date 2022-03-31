import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import { get } from "lodash";

import { useTheme, Grid, Chip } from "@mui/material";

import ConnectServiceSelect from "./Select";
import { getLabel } from "./utils";

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
      render={({ field: { onChange, onBlur, value } }) => {
        const handleDelete = (id: any) => () => {
          // if (multiple)
          onChange(value.filter((v) => get(v, config.elementId) !== id));
          // else form.setFieldValue(field.name, []);
        };

        return (
          <>
            {!disabled && (
              <ConnectServiceSelect
                column={column}
                value={value}
                onChange={onChange}
                docRef={docRef}
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
                {value.map((item) => {
                  const key = get(item, config.elementId);
                  console.log(key, item);
                  return (
                    <Grid item key={key}>
                      <Chip
                        component="li"
                        label={getLabel(config, item)}
                        onDelete={disabled ? undefined : handleDelete(key)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        );
      }}
    />
  );
}
