import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { ChevronDown } from "@src/assets/icons";

import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import { getDurationString } from "./utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import {
  transformValue,
  sanitizeValue,
} from "@src/components/fields/Date/utils";

export default function Duration({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const format = column.config?.format ?? DATE_TIME_FORMAT;

  const startValue = transformValue(value?.start);
  const endValue = transformValue(value?.end);

  const handleChange = (pos: "start" | "end") => (date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) return;
    onChange({ start: startValue, end: endValue, [pos]: sanitized });
  };

  return (
    <>
      <Box
        sx={[fieldSx, (!startValue || !endValue) && { color: "text.disabled" }]}
        id={getFieldId(column.key)}
      >
        {startValue && endValue
          ? getDurationString(startValue, endValue)
          : "00h 00m 00s"}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
        <DateTimePicker
          renderInput={(props) => (
            <TextField
              {...props}
              label="Start"
              fullWidth
              hiddenLabel
              aria-label={column.name as string}
              sx={{
                "& .MuiInputBase-input": { fontVariantNumeric: "tabular-nums" },
                "& .MuiInputAdornment-root": { m: 0 },
              }}
              // Touch mode: make the whole field clickable
              onClick={props.inputProps?.onClick as any}
              onBlur={onSubmit}
            />
          )}
          label={column.name + ": Start"}
          value={startValue}
          onChange={handleChange("start")}
          onAccept={onSubmit}
          inputFormat={format}
          mask={format.replace(/[A-Za-z]/g, "_")}
          OpenPickerButtonProps={{ size: "small" }}
          components={{ OpenPickerIcon: ChevronDown }}
          disableOpenPicker={false}
          disabled={disabled}
          hideTabs={false}
        />

        <DateTimePicker
          renderInput={(props) => (
            <TextField
              {...props}
              fullWidth
              label="End"
              hiddenLabel
              aria-label={column.name as string}
              sx={{
                "& .MuiInputBase-input": { fontVariantNumeric: "tabular-nums" },
                "& .MuiInputAdornment-root": { m: 0 },
              }}
              // Touch mode: make the whole field clickable
              onClick={props.inputProps?.onClick as any}
              onBlur={onSubmit}
            />
          )}
          label={column.name + ": End"}
          value={endValue}
          onChange={handleChange("end")}
          onAccept={onSubmit}
          inputFormat={format}
          mask={format.replace(/[A-Za-z]/g, "_")}
          OpenPickerButtonProps={{ size: "small" }}
          components={{ OpenPickerIcon: ChevronDown }}
          disableOpenPicker={false}
          disabled={disabled}
          hideTabs={false}
        />
      </Stack>
    </>
  );
}
