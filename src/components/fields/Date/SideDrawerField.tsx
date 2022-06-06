import { ISideDrawerFieldProps } from "@src/components/fields/types";

import DatePicker from "@mui/lab/DatePicker";
import { TextField } from "@mui/material";

import { getFieldId } from "@src/components/SideDrawer/utils";
import { transformValue, sanitizeValue } from "./utils";
import { DATE_FORMAT } from "@src/constants/dates";
import { DateIcon } from ".";

export interface IDateProps extends ISideDrawerFieldProps {}

export default function Date_({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: IDateProps) {
  const format = column.config?.format ?? DATE_FORMAT;

  const transformedValue = transformValue(value);

  const handleChange = (date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) return;
    onChange(sanitized);
  };

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
              <DateIcon color="action" />
            ),
          }}
          sx={{
            "& .MuiInputBase-input": { fontVariantNumeric: "tabular-nums" },
            "& .MuiInputAdornment-root": { m: 0 },
          }}
          // Touch mode: make the whole field clickable
          onClick={props.inputProps?.onClick as any}
          onBlur={onSubmit}
          id={getFieldId(column.key)}
        />
      )}
      label={column.name}
      value={transformedValue}
      onChange={handleChange}
      onAccept={onSubmit}
      inputFormat={format}
      mask={format.replace(/[A-Za-z]/g, "_")}
      clearable
      OpenPickerButtonProps={{ size: "small" }}
      components={{ OpenPickerIcon: DateIcon }}
      disableOpenPicker={false}
      disabled={disabled}
    />
  );
}
