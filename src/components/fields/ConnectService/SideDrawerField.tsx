import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { get } from "lodash-es";

import { Grid, Chip } from "@mui/material";

import ConnectServiceSelect from "./ConnectServiceSelect";
import { getFieldId } from "@src/components/SideDrawer/utils";

export default function ConnectService({
  column,
  _rowy_ref,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};
  const displayKey = config.titleKey ?? config.primaryKey;

  const handleDelete = (hit: any) => () => {
    // if (multiple)
    onChange(
      value.filter(
        (v: any) => get(v, config.primaryKey) !== get(hit, config.primaryKey)
      )
    );
    onSubmit();
    // else form.setFieldValue(field.name, []);
  };

  return (
    <>
      {!disabled && (
        <ConnectServiceSelect
          config={(config as any) ?? {}}
          value={value}
          onChange={onChange}
          docRef={_rowy_ref as any}
          TextFieldProps={{
            label: "",
            hiddenLabel: true,
            fullWidth: true,
            onBlur: onSubmit,
            id: getFieldId(column.key),
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
}
