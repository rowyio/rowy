import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { ButtonBase, FormControlLabel, Switch } from "@mui/material";

import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";

export default function Checkbox({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <ButtonBase sx={fieldSx} disabled={disabled}>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onSubmit}
            disabled={disabled}
            color="success"
            id={getFieldId(column.key)}
          />
        }
        label={column.name as string}
        labelPlacement="start"
        sx={{
          mx: 0,
          my: -0.25,
          width: "100%",
          alignItems: "center",

          "& .MuiFormControlLabel-label": {
            font: "inherit",
            letterSpacing: "inherit",
            flexGrow: 1,
            overflowX: "hidden",
            mt: 0,
          },

          "& .MuiSwitch-root": { mr: -1.25 },
        }}
      />
    </ButtonBase>
  );
}
