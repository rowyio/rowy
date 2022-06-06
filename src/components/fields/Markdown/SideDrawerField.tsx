import { useTheme } from "@mui/material";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import MDEditor from "@uiw/react-md-editor";

export default function Code({
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const theme = useTheme();
  return (
    <div data-color-mode={theme.palette.mode}>
      <MDEditor
        aria-disabled={disabled}
        height={200}
        value={value}
        onChange={onChange}
        onBlur={onSubmit}
      />
    </div>
  );
}
