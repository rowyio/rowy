import { useDebouncedCallback } from "use-debounce";
import { IHeavyCellProps } from "@src/components/fields/types";
import { setSeconds } from "date-fns";

import DateTimePicker from "@mui/lab/DateTimePicker";
import { TextField } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import {
  transformValue,
  sanitizeValue,
} from "@src/components/fields/Date/utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import BasicCell from "./BasicCell";

export default function DateTime({
  column,
  value,
  disabled,
  onSubmit,
}: IHeavyCellProps) {
  const transformedValue = transformValue(value);

  const handleDateChange = useDebouncedCallback((date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (!sanitized) return; // Temp disable setting it to null
    onSubmit(sanitized);
  }, 500);

  const format = column.config?.format ?? DATE_TIME_FORMAT;

  if (disabled)
    return (
      <BasicCell
        value={transformedValue}
        type={(column as any).type}
        name={column.key}
        format={format}
      />
    );

  return (
    <DateTimePicker
      renderInput={(props) => (
        <TextField
          {...props}
          fullWidth
          label=""
          hiddenLabel
          aria-label={column.name as string}
          className="cell-collapse-padding"
          sx={{
            width: "100%",
            height: "100%",

            "& .MuiInputBase-root": {
              height: "100%",
              font: "inherit", // Prevent text jumping
              letterSpacing: "inherit", // Prevent text jumping

              ".rdg-cell &": {
                background: "none !important",
                boxShadow: "none",
                borderRadius: 0,
                padding: 0,

                "&::after": { width: "100%", left: 0 },
              },
            },
            "& .MuiInputBase-input": {
              height: "100%",
              font: "inherit", // Prevent text jumping
              letterSpacing: "inherit", // Prevent text jumping
              fontVariantNumeric: "tabular-nums",

              ".rdg-cell &": {
                padding: "var(--cell-padding)",
                pr: 0,
                pb: 1 / 8,
              },
            },
            "& .MuiInputAdornment-root": { m: 0 },
          }}
          // Prevent react-data-grid showing NullEditor, which unmounts this field
          onDoubleClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          // Touch mode: make the whole field clickable
          onClick={props.inputProps?.onClick as any}
        />
      )}
      label={column.name}
      value={transformedValue}
      onChange={(date) => handleDateChange(date ? setSeconds(date, 0) : null)}
      inputFormat={format}
      mask={format.replace(/[A-Za-z]/g, "_")}
      clearable
      OpenPickerButtonProps={{
        size: "small",
        className: "row-hover-iconButton",
        edge: false,
        sx: { mr: 3 / 8, width: 32, height: 32 },
      }}
      components={{ OpenPickerIcon: ChevronDown }}
      disableOpenPicker={false}
    />
  );
}
