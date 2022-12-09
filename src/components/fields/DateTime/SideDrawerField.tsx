import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { setSeconds } from "date-fns";

import { DateTimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import {
  transformValue,
  sanitizeValue,
} from "@src/components/fields/Date/utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { getFieldId } from "@src/components/SideDrawer/utils";

export interface IDateProps extends ISideDrawerFieldProps {}

export default function DateTime({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: IDateProps) {
  const format = column.config?.format ?? DATE_TIME_FORMAT;

  const transformedValue = transformValue(value);

  const handleChange = (date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) return;
    onChange(sanitized);
  };

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
      onChange={(date: any) => handleChange(date ? setSeconds(date, 0) : null)}
      onAccept={onSubmit}
      inputFormat={format}
      mask={format.replace(/[A-Za-z]/g, "_")}
      OpenPickerButtonProps={{
        size: "small",
        sx: { width: 32, height: 32 },
      }}
      components={{ OpenPickerIcon: ChevronDown }}
      disableOpenPicker={false}
      disabled={disabled}
      hideTabs={false}
    />
  );
}
