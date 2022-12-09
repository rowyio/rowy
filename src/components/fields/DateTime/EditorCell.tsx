import { useDebouncedCallback } from "use-debounce";
import { IEditorCellProps } from "@src/components/fields/types";
import { setSeconds } from "date-fns";

import { DateTimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import {
  transformValue,
  sanitizeValue,
} from "@src/components/fields/Date/utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

export default function DateTime({
  column,
  value,
  disabled,
  onChange,
  onSubmit,
  tabIndex,
}: IEditorCellProps) {
  const transformedValue = transformValue(value);

  const handleDateChange = useDebouncedCallback((date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (!sanitized) return; // Temp disable setting it to null
    onChange(sanitized);
    onSubmit();
  }, 500);

  const format = column.config?.format ?? DATE_TIME_FORMAT;

  return (
    <DateTimePicker
      renderInput={(props) => (
        <TextField
          {...props}
          fullWidth
          label=""
          hiddenLabel
          aria-label={column.name as string}
          sx={{
            width: "100%",
            height: "100%",

            "&& .MuiInputBase-root": {
              height: "100%",
              font: "inherit", // Prevent text jumping
              letterSpacing: "inherit", // Prevent text jumping

              background: "none !important",
              boxShadow: "none",
              borderRadius: 0,
              padding: 0,

              "&::after": { width: "100%", left: 0 },
            },
            "& .MuiInputBase-input": {
              height: "100%",
              font: "inherit", // Prevent text jumping
              letterSpacing: "inherit", // Prevent text jumping
              fontVariantNumeric: "tabular-nums",

              padding: "0 var(--cell-padding)",
              pr: 0,
              pb: 1 / 8,
            },
            "& .MuiInputAdornment-root": { m: 0 },
          }}
          autoFocus
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ ...props.inputProps, tabIndex }}
        />
      )}
      label={column.name}
      value={transformedValue}
      onChange={(date) => handleDateChange(date ? setSeconds(date, 0) : null)}
      inputFormat={format}
      OpenPickerButtonProps={{
        size: "small",
        className: "row-hover-iconButton end",
        edge: false,
        tabIndex,
      }}
      components={{ OpenPickerIcon: ChevronDown }}
      disableOpenPicker={false}
      disabled={disabled}
      PopperProps={{ onClick: (e) => e.stopPropagation() }}
      hideTabs={false}
    />
  );
}
