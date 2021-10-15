import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import _camelCase from "lodash/camelCase";

import { TextField, TextFieldProps } from "@mui/material";
import { IFieldComponentProps, FieldAssistiveText } from "@rowy/form-builder";

export interface ICamelCaseIdProps
  extends IFieldComponentProps,
    Omit<
      TextFieldProps,
      "variant" | "name" | "label" | "onBlur" | "onChange" | "value" | "ref"
    > {
  watchedField?: string;
}

export default function CamelCaseId({
  field: { onChange, onBlur, value, ref },

  name,
  useFormMethods: { control },

  errorMessage,
  assistiveText,

  disabled,

  watchedField,
  ...props
}: ICamelCaseIdProps) {
  const watchedValue = useWatch({ control, name: watchedField } as any);
  useEffect(() => {
    if (!disabled && typeof watchedValue === "string" && !!watchedValue)
      onChange(_camelCase(watchedValue));
  }, [watchedValue, disabled]);

  return (
    <TextField
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      fullWidth
      error={!!errorMessage}
      helperText={
        (errorMessage || assistiveText) && (
          <>
            {errorMessage}

            <FieldAssistiveText style={{ margin: 0 }} disabled={!!disabled}>
              {assistiveText}
            </FieldAssistiveText>
          </>
        )
      }
      name={name}
      id={`field-${name}`}
      sx={{ "& .MuiInputBase-input": { fontFamily: "mono" } }}
      {...props}
      disabled={disabled}
      inputProps={{
        required: false,
        // https://github.com/react-hook-form/react-hook-form/issues/4485
        disabled: false,
        readOnly: disabled,
        style: disabled ? { cursor: "default" } : undefined,
      }}
      inputRef={ref}
    />
  );
}
