import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function Reference({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => <></>}
    />
  );
}
