import { IDisplayCellProps } from "@src/components/fields/types";

import { FormControlLabel, Switch } from "@mui/material";

export default function Checkbox({ column, value }: IDisplayCellProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={!!value}
          color="success"
          tabIndex={-1}
          readOnly
          sx={{
            pointerEvents: "none",
            "& .MuiSwitch-thumb:active": { transform: "none" },
          }}
        />
      }
      label={column.name as string}
      labelPlacement="start"
      sx={{
        m: 0,
        width: "100%",
        alignItems: "center",

        cursor: "default",

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
