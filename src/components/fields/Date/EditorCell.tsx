import { useDebouncedCallback } from "use-debounce";
import { IEditorCellProps } from "@src/components/fields/types";

import DatePicker from "@mui/lab/DatePicker";
import { TextField } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import { transformValue, sanitizeValue } from "./utils";
import { DATE_FORMAT } from "@src/constants/dates";

export default function Date_({
  column,
  value,
  disabled,
  onChange,
  onSubmit,
  tabIndex,
}: IEditorCellProps) {
  const format = column.config?.format ?? DATE_FORMAT;
  const transformedValue = transformValue(value);

  const handleDateChange = useDebouncedCallback((date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) return;
    onChange(sanitized);
    onSubmit();
  }, 500);

  return (
    <DatePicker
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
          // Prevent react-data-grid showing NullEditor, which unmounts this field
          onDoubleClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          // Touch mode: make the whole field clickable
          onClick={props.inputProps?.onClick as any}
          inputProps={{ ...props.inputProps, tabIndex }}
        />
      )}
      label={column.name}
      value={transformedValue}
      onChange={handleDateChange}
      inputFormat={format}
      mask={format.replace(/[A-Za-z]/g, "_")}
      clearable
      OpenPickerButtonProps={{
        size: "small",
        className: "row-hover-iconButton end",
        edge: false,
        tabIndex,
      }}
      components={{ OpenPickerIcon: ChevronDown }}
      disableOpenPicker={false}
      disabled={disabled}
    />
  );
}
