import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { ButtonBase, FormControlLabel, Switch } from "@mui/material";

import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";

export default function Checkbox({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.checked);
        };

        return (
          <ButtonBase className={fieldClasses.root} disabled={disabled}>
            <FormControlLabel
              control={
                <Switch
                  checked={value}
                  onChange={handleChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  color="success"
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
      }}
    />
  );
}
