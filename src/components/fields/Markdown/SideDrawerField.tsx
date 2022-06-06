import { ISideDrawerFieldProps } from "@src/components/fields/types";

import MDEditor from "@uiw/react-md-editor";

export default function Code({
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <MDEditor
      aria-disabled={disabled}
      height={200}
      value={value}
      onChange={onChange}
      onBlur={onSubmit}
    />
  );
}
