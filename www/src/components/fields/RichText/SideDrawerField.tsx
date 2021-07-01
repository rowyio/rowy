import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import _RichText from "components/RichTextEditor";

export default function RichTextEditor({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, value }) => (
        <_RichText disabled={disabled} value={value} onChange={onChange} />
      )}
    />
  );
}
