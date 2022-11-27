import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { get } from "lodash-es";

import { Grid, Chip } from "@mui/material";

import ConnectorSelect from "./Select";
import { getLabel } from "./utils";
import { getFieldId } from "@src/components/SideDrawer/utils";

export default function Connector({
  column,
  _rowy_ref,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};

  const handleDelete = (id: any) => () => {
    // if (multiple)
    onChange(value.filter((v: any) => get(v, config.elementId) !== id));
    // else form.setFieldValue(field.name, []);
    onSubmit();
  };

  return (
    <>
      {!disabled && (
        <ConnectorSelect
          column={column}
          value={value}
          onChange={onChange}
          _rowy_ref={_rowy_ref}
          TextFieldProps={{
            label: "",
            hiddenLabel: true,
            fullWidth: true,
            onBlur: onSubmit,
            SelectProps: {
              renderValue: () => `${value?.length ?? 0} selected`,
            },
            id: getFieldId(column.key),
          }}
        />
      )}

      {Array.isArray(value) && (
        <Grid container spacing={0.5} style={{ marginTop: 2 }}>
          {value.map((item) => {
            const key = get(item, config.elementId);
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
}
