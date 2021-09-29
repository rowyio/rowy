import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import MultiSelect from "@rowy/multiselect";
import { sanitiseValue } from "./utils";

export default function SingleSelect({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <MultiSelect
            value={sanitiseValue(value)}
            onChange={onChange}
            options={config.options ?? []}
            multiple={false}
            freeText={config.freeText}
            disabled={disabled}
            TextFieldProps={{
              label: "",
              hiddenLabel: true,
              onBlur,
              id: `sidedrawer-field-${column.key}`,
            }}
          />
        </>
      )}
    />
  );
}
