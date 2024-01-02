import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { TextField } from "@mui/material";
import { getFieldId } from "@src/components/SideDrawer/utils";

export default function Number_({
  column,
  value,
  onChange = () => {},
  onSubmit = () => {},
  disabled,
}: ISideDrawerFieldProps<number | string>) {
  return (
    <TextField
      variant="filled"
      fullWidth
      margin="none"
      onChange={(e) => {
        // Safari/Firefox gives us an empty string for invalid inputs, which includes inputs like "12." on the way to
        // typing "12.34". Number would cast these to 0 and replace the user's input to 0 whilst they're mid-way through
        // typing. We want to avoid that.
        const parsedValue =
          e.target.value === "" ? e.target.value : Number(e.target.value);
        onChange(parsedValue);
      }}
      onBlur={() => {
        // Cast to number when the user has finished editing
        onChange(Number(value));
        onSubmit();
      }}
      value={value}
      id={getFieldId(column.key)}
      label=""
      hiddenLabel
      disabled={disabled}
      type="number"
    />
  );
}
