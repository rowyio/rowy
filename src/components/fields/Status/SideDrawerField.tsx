import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import MultiSelect from "@rowy/multiselect";
import getLabel from "./utils/getLabelHelper";

export default function Status({
  control,
  column,
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
            value={getLabel(value, config?.conditions)}
            onChange={onChange}
            options={config?.conditions ?? []}
            multiple={false}
            freeText={config?.freeText}
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
