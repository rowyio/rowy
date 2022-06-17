import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { TextField } from "@mui/material";
import { getFieldId } from "@src/components/SideDrawer/utils";

export default function ShortText({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <TextField
      variant="filled"
      fullWidth
      margin="none"
      onChange={(e) => onChange(e.target.value)}
      onBlur={onSubmit}
      value={value}
      id={getFieldId(column.key)}
      label=""
      hiddenLabel
      disabled={disabled}
      inputProps={{ maxLength: column.config?.maxLength }}
    />
  );
}
