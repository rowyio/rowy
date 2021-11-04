import { useDebouncedCallback } from "use-debounce";
import { IHeavyCellProps } from "../types";

import DatePicker from "@mui/lab/DatePicker";
import { TextField } from "@mui/material";

import { transformValue, sanitizeValue } from "./utils";
import { DATE_FORMAT } from "@src/constants/dates";
import BasicCell from "./BasicCell";
import { DateIcon } from ".";

export default function Date_({
  column,
  value,
  disabled,
  onSubmit,
}: IHeavyCellProps) {
  const format = column.config?.format ?? DATE_FORMAT;
  const transformedValue = transformValue(value);

  const [handleDateChange] = useDebouncedCallback((date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) return;
    onSubmit(sanitized);
  }, 500);

  if (disabled)
    return (
      <BasicCell
        value={value}
        type={(column as any).type}
        name={column.key}
        format={format}
      />
    );

  return (
    <DatePicker
      renderInput={(props) => (
        <TextField
          {...props}
          fullWidth
          label=""
          hiddenLabel
          aria-label={column.name as string}
          InputProps={{
            ...props.InputProps,
            endAdornment: props.InputProps?.endAdornment || (
              <DateIcon
                className="row-hover-iconButton"
                sx={{
                  borderRadius: 1,
                  p: (32 - 24) / 2 / 8,
                  boxSizing: "content-box",
                  mr: 0.5,
                }}
              />
            ),
          }}
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
      onChange={handleDateChange}
      inputFormat={format}
      mask={format.replace(/[A-Za-z]/g, "_")}
      clearable
      OpenPickerButtonProps={{
        size: "small",
        className: "row-hover-iconButton",
        edge: false,
        sx: { mr: 0.5 },
      }}
      components={{ OpenPickerIcon: DateIcon }}
      disableOpenPicker={false}
    />
  );
}
