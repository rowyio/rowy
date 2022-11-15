import { IDisplayCellProps } from "@src/components/fields/types";

import { FormControlLabel, Switch } from "@mui/material";

export default function Checkbox({ column, value }: IDisplayCellProps) {
  return (
    <FormControlLabel
      control={
        <Switch checked={!!value} disabled color="success" tabIndex={-1} />
      }
      label={column.name as string}
      labelPlacement="start"
      sx={{
        m: 0,
        width: "100%",
        alignItems: "center",

        "& .MuiFormControlLabel-label": {
          font: "inherit",
          letterSpacing: "inherit",
          flexGrow: 1,
          overflowX: "hidden",
          mt: "0 !important",
        },

        "& .MuiSwitch-root": { mr: -0.75 },
      }}
    />
  );
}
