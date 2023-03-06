import {
  TextField,
  FilledTextFieldProps,
  InputAdornment,
  MenuItem,
} from "@mui/material";

import type { CloudLogFilters } from "@src/atoms/tableScope";

export interface ITimeRangeSelectProps
  extends Partial<Omit<FilledTextFieldProps, "value" | "onChange">> {
  value: CloudLogFilters["timeRange"];
  onChange: (value: CloudLogFilters["timeRange"]) => void;
}

export default function TimeRangeSelect({
  value,
  onChange,
  ...props
}: ITimeRangeSelectProps) {
  return (
    <fieldset
      style={{ appearance: "none", padding: 0, border: 0, display: "flex" }}
    >
      {value && value.type !== "range" && (
        <TextField
          aria-label={`Custom ${value.type} value`}
          id="timeRangeSelect.value"
          type="number"
          value={value.value}
          onChange={(e) =>
            onChange({ type: value.type, value: Number(e.target.value) })
          }
          sx={{
            mr: "-1px",
            "& .MuiInputBase-root": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },

            "& .MuiInputAdornment-positionStart": {
              mt: "0 !important",
              pointerEvents: "none",
              mr: -0.75,
            },

            "& .MuiInputBase-input": {
              width: "calc(3ch + 16px)",
              pr: 0,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Last</InputAdornment>
            ),
          }}
          inputProps={{ min: 1 }}
        />
      )}

      <TextField
        select
        id="timeRangeSelect.type"
        value={value?.type || "days"}
        {...props}
        sx={{
          "& .MuiInputBase-root":
            value?.type !== "range"
              ? {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }
              : {},

          "& .MuiInputBase-input": { minHeight: 20 },

          ...props.sx,
        }}
        onChange={(e) => {
          const newValue: any = { type: e.target.value };

          if (e.target.value === "seconds") newValue.value = 30;
          else if (e.target.value === "minutes") newValue.value = 15;
          else if (e.target.value === "hours") newValue.value = 3;
          else if (e.target.value === "days") newValue.value = 7;

          onChange(newValue);
        }}
      >
        <MenuItem value="seconds">seconds</MenuItem>
        <MenuItem value="minutes">minutes</MenuItem>
        <MenuItem value="hours">hours</MenuItem>
        <MenuItem value="days">days</MenuItem>
        {/* <MenuItem value="range">Custom range…</MenuItem> */}
      </TextField>
    </fieldset>
  );
}
